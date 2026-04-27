<template>
  <div class="restocking">
    <div class="page-header">
      <h2>{{ t('restocking.title') }}</h2>
      <p>{{ t('restocking.subtitle') }}</p>
    </div>

    <!-- Budget input -->
    <div class="budget-card">
      <div class="budget-input-row">
        <label class="budget-label">{{ t('restocking.budgetCeiling') }}</label>
        <div class="budget-input-wrap">
          <span class="currency-symbol">{{ currentCurrency === 'JPY' ? '¥' : '$' }}</span>
          <input
            v-model.number="budgetCeiling"
            type="number"
            min="0"
            step="100"
            class="budget-input"
            :placeholder="t('restocking.budgetPlaceholder')"
          />
        </div>
      </div>
      <div v-if="recommendations.length" class="budget-summary">
        <div class="budget-stat">
          <span class="budget-stat-label">{{ t('restocking.totalEstimated') }}</span>
          <span class="budget-stat-value">{{ formatCurrency(totalCost) }}</span>
        </div>
        <div v-if="budgetCeiling" class="budget-stat">
          <span class="budget-stat-label">{{ t('restocking.budgetRemaining') }}</span>
          <span class="budget-stat-value" :class="budgetCeiling - totalCost < 0 ? 'over-budget' : 'under-budget'">
            {{ formatCurrency(budgetCeiling - totalCost) }}
          </span>
        </div>
        <div class="budget-note">
          {{ budgetCeiling ? t('restocking.withinBudget') : t('restocking.allItems') }}
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading">{{ t('common.loading') }}</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="!recommendations.length" class="empty-state">
      {{ t('restocking.noItems') }}
    </div>
    <div v-else class="card">
      <div class="card-header">
        <h3 class="card-title">
          {{ t('restocking.title') }} ({{ recommendations.length }})
        </h3>
      </div>
      <div class="table-container">
        <table class="restocking-table">
          <thead>
            <tr>
              <th>{{ t('restocking.table.sku') }}</th>
              <th>{{ t('restocking.table.name') }}</th>
              <th>{{ t('restocking.table.category') }}</th>
              <th>{{ t('restocking.table.warehouse') }}</th>
              <th>{{ t('restocking.table.currentStock') }}</th>
              <th>{{ t('restocking.table.reorderPoint') }}</th>
              <th>{{ t('restocking.table.recommendedQty') }}</th>
              <th>{{ t('restocking.table.estimatedCost') }}</th>
              <th>{{ t('restocking.table.priority') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in recommendations" :key="item.id">
              <td><code class="sku">{{ item.sku }}</code></td>
              <td>{{ translateProductName(item.name) }}</td>
              <td>{{ item.category }}</td>
              <td>{{ translateWarehouse(item.warehouse) }}</td>
              <td>
                <span class="stock-value" :class="item.priority === 'high' ? 'stock-critical' : 'stock-low'">
                  {{ item.quantity_on_hand }}
                </span>
              </td>
              <td>{{ item.reorder_point }}</td>
              <td><strong>{{ item.recommended_qty }}</strong></td>
              <td>{{ formatCurrency(item.estimated_cost) }}</td>
              <td><span :class="['badge', item.priority]">{{ t(`priority.${item.priority}`) }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'
import { api } from '../api'
import { useFilters } from '../composables/useFilters'
import { useI18n } from '../composables/useI18n'

export default {
  name: 'Restocking',
  setup() {
    const { t, currentCurrency, translateProductName, translateWarehouse } = useI18n()
    const { selectedLocation, selectedCategory, getCurrentFilters } = useFilters()

    const loading = ref(true)
    const error = ref(null)
    const recommendations = ref([])
    const budgetCeiling = ref(null)

    const totalCost = computed(() =>
      recommendations.value.reduce((sum, r) => sum + r.estimated_cost, 0)
    )

    const loadData = async () => {
      try {
        loading.value = true
        error.value = null
        const filters = getCurrentFilters()
        if (budgetCeiling.value) filters.budget = budgetCeiling.value
        recommendations.value = await api.getRestockingRecommendations(filters)
      } catch (err) {
        error.value = 'Failed to load recommendations: ' + err.message
      } finally {
        loading.value = false
      }
    }

    const formatCurrency = (num) => {
      return new Intl.NumberFormat(currentCurrency.value === 'JPY' ? 'ja-JP' : 'en-US', {
        style: 'currency',
        currency: currentCurrency.value,
        maximumFractionDigits: 2
      }).format(num)
    }

    watch([selectedLocation, selectedCategory], loadData)
    watch(budgetCeiling, loadData)
    onMounted(loadData)

    return {
      t, currentCurrency, translateProductName, translateWarehouse,
      loading, error, recommendations, budgetCeiling, totalCost,
      formatCurrency
    }
  }
}
</script>

<style scoped>
.restocking { padding: 0; }

.budget-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.budget-input-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.budget-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  white-space: nowrap;
}

.budget-input-wrap {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
}

.currency-symbol { font-weight: 600; color: #64748b; }

.budget-input {
  border: none;
  background: transparent;
  font-size: 1rem;
  color: #0f172a;
  width: 200px;
  outline: none;
}

.budget-summary {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
  flex-wrap: wrap;
}

.budget-stat { display: flex; flex-direction: column; gap: 2px; }
.budget-stat-label { font-size: 0.75rem; color: #64748b; }
.budget-stat-value { font-size: 1.25rem; font-weight: 700; color: #0f172a; }
.budget-stat-value.under-budget { color: #16a34a; }
.budget-stat-value.over-budget { color: #dc2626; }
.budget-note { font-size: 0.8rem; color: #94a3b8; margin-left: auto; }

.card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.card-header { margin-bottom: 1.5rem; }
.card-title { font-size: 1.25rem; font-weight: 600; color: #0f172a; margin: 0; }

.restocking-table { width: 100%; border-collapse: collapse; }
.restocking-table th {
  background: #f8fafc;
  padding: 0.75rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.8rem;
  color: #64748b;
  border-bottom: 2px solid #e2e8f0;
  white-space: nowrap;
}
.restocking-table td {
  padding: 0.75rem;
  border-bottom: 1px solid #e2e8f0;
  font-size: 0.9rem;
  color: #374151;
}
.restocking-table tr:hover td { background: #f8fafc; }

.sku {
  font-family: monospace;
  font-size: 0.85rem;
  background: #f1f5f9;
  padding: 2px 6px;
  border-radius: 4px;
  color: #475569;
}

.stock-value { font-weight: 600; }
.stock-critical { color: #dc2626; }
.stock-low { color: #d97706; }

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #64748b;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  font-size: 1.1rem;
}

.loading {
  text-align: center;
  padding: 3rem;
  color: #64748b;
}

.error {
  background: #fee2e2;
  color: #991b1b;
  padding: 1rem;
  border-radius: 8px;
}
</style>
