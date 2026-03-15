import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Sidebar } from '../components/organisms/Sidebar'
import { DividendTable } from '../components/molecules/DividendTable'
import { DividendChart } from '../components/molecules/DividendChart'
import { TradesTable } from '../components/molecules/TradesTable'
import { TaxSummaryWidget } from '../components/molecules/TaxSummaryWidget'
import { DividendModal } from '../components/organisms/DividendModal'
import { useDividends } from '../hooks/useDividends'
import { Button } from '../components/atoms/Button'
import { UploadButton } from '../components/atoms/UploadButton'
import { type Dividend } from '../components/molecules/DividendTable/types'
import { type DividendPayload } from '../api/dividends'
import { MOCK_BUYS, MOCK_SELLS } from '../mocks/transactions'

type SidebarView = 'trades' | 'dividends'

export const SharesPage = () => {
  const { t } = useTranslation()
  const [activeView, setActiveView] = useState<SidebarView>('trades')
  const [modalOpen, setModalOpen] = useState(false)
  const [editItem, setEditItem] = useState<Dividend | null>(null)

  const { dividends, loading, create, update, remove } = useDividends()

  const SIDEBAR_OPTIONS = [
    { id: 'trades', label: t('sidebar.trades') },
    { id: 'dividends', label: t('sidebar.dividends') },
  ]

  const handleSubmit = async (payload: DividendPayload) => {
    if (editItem) await update(editItem.id, payload)
    else await create(payload)
    setEditItem(null)
  }

  const handleEdit = (row: Dividend) => {
    setEditItem(row)
    setModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Delete this dividend?')) await remove(id)
  }

  const handleFileUpload = (_file: File) => {
    // TODO: parse IBKR CSV file
  }

  return (
    <div className="flex gap-4 w-full overflow-hidden">
      <div className="shrink-0">
        <Sidebar
          options={SIDEBAR_OPTIONS}
          activeId={activeView}
          onChange={(id) => setActiveView(id as SidebarView)}
        />
      </div>

      <div className="flex-1 min-w-0 overflow-hidden">
        {activeView === 'trades' && (
          <div className="flex flex-col xl:flex-row gap-6">
            <div className="flex-1 min-w-0 overflow-hidden">
              <TradesTable title={t('table.buy')} data={MOCK_BUYS} accentColor="green" />
            </div>
            <div className="flex-1 min-w-0 overflow-hidden">
              <TradesTable title={t('table.sell')} data={MOCK_SELLS} accentColor="red" />
            </div>
          </div>
        )}

        {activeView === 'dividends' && (
          <div className="flex gap-4 items-start">
            <div className="flex-1 min-w-0 overflow-hidden flex flex-col gap-4">
              {loading ? (
                <p className="text-gray-400 text-sm">{t('auth.loading')}</p>
              ) : (
                <>
                  <DividendTable
                    data={dividends}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    headerAction={
                      <div className="flex items-center gap-3">
                        <UploadButton label={t('dividendModal.upload')} onFile={handleFileUpload} />
                        <div className="w-px h-5 bg-gray-700" />
                        <Button
                          size="sm"
                          onClick={() => {
                            setEditItem(null)
                            setModalOpen(true)
                          }}
                        >
                          + {t('dividendModal.add')}
                        </Button>
                      </div>
                    }
                  />
                  <DividendChart dividends={dividends} />
                </>
              )}
            </div>
            <TaxSummaryWidget dividends={dividends} />
          </div>
        )}
      </div>

      <DividendModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditItem(null)
        }}
        onSubmit={handleSubmit}
        initial={editItem}
      />
    </div>
  )
}
