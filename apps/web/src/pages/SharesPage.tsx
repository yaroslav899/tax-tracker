import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Sidebar } from '../components/organisms/Sidebar'
import { DividendTable } from '../components/molecules/DividendTable'
import { DividendChart } from '../components/molecules/DividendChart'
import { TradesTable } from '../components/molecules/TradesTable'
import { PortfolioWidget } from '../components/molecules/PortfolioWidget'
import { TaxSummaryWidget } from '../components/molecules/TaxSummaryWidget'
import { DividendModal } from '../components/organisms/DividendModal'
import { TradeModal } from '../components/organisms/TradeModal'
import { useDividends } from '../hooks/useDividends'
import { useTrades } from '../hooks/useTrades'
import { Button } from '../components/atoms/Button'
import { UploadButton } from '../components/atoms/UploadButton'
import { type Dividend } from '../components/molecules/DividendTable/types'
import { type Trade } from '../components/molecules/TradesTable/types'
import { type DividendPayload } from '../api/dividends'
import { type TradePayload } from '../api/trades'

type SidebarView = 'trades' | 'dividends'

export const SharesPage = () => {
  const { t } = useTranslation()
  const [activeView, setActiveView] = useState<SidebarView>('trades')

  const [dividendModalOpen, setDividendModalOpen] = useState(false)
  const [editDividend, setEditDividend] = useState<Dividend | null>(null)
  const {
    dividends,
    loading: dividendsLoading,
    create: createDividend,
    update: updateDividend,
    remove: removeDividend,
  } = useDividends()

  const [tradeModalOpen, setTradeModalOpen] = useState(false)
  const [tradeModalType, setTradeModalType] = useState<'BUY' | 'SELL'>('BUY')
  const [editTrade, setEditTrade] = useState<Trade | null>(null)
  const {
    buys,
    sells,
    loading: tradesLoading,
    create: createTrade,
    update: updateTrade,
    remove: removeTrade,
  } = useTrades()

  const SIDEBAR_OPTIONS = [
    { id: 'trades', label: t('sidebar.trades') },
    { id: 'dividends', label: t('sidebar.dividends') },
  ]

  const handleDividendSubmit = async (payload: DividendPayload) => {
    if (editDividend) await updateDividend(editDividend.id, payload)
    else await createDividend(payload)
    setEditDividend(null)
  }

  const handleTradeSubmit = async (payload: TradePayload) => {
    if (editTrade) await updateTrade(editTrade.id, payload)
    else await createTrade(payload)
    setEditTrade(null)
  }

  const openTradeModal = (type: 'BUY' | 'SELL', trade?: Trade) => {
    setTradeModalType(type)
    setEditTrade(trade ?? null)
    setTradeModalOpen(true)
  }

  const handleTradeDelete = async (id: string, type: 'BUY' | 'SELL') => {
    if (confirm('Delete this trade?')) await removeTrade(id, type)
  }

  const handleFileUpload = (_file: File) => {
    // TODO: parse IBKR CSV file
  }

  // Simple header: upload icon + add button
  const tradeHeader = (type: 'BUY' | 'SELL') => (
    <div className="flex items-center gap-2">
      <UploadButton label="📂" onFile={handleFileUpload} />
      <Button
        size="sm"
        variant={type === 'BUY' ? 'primary' : 'ghost'}
        onClick={() => openTradeModal(type)}
      >
        + {type === 'BUY' ? t('table.buy') : t('table.sell')}
      </Button>
    </div>
  )

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
          <>
            {tradesLoading ? (
              <p className="text-gray-400 text-sm">{t('auth.loading')}</p>
            ) : (
              <div className="flex gap-4 items-start">
                <div className="w-52 shrink-0">
                  <PortfolioWidget buys={buys} sells={sells} />
                </div>
                <div className="flex-1 min-w-0 overflow-hidden">
                  <TradesTable
                    title={t('table.buy')}
                    data={buys}
                    accentColor="green"
                    onEdit={(row) => openTradeModal('BUY', row)}
                    onDelete={(id) => handleTradeDelete(id, 'BUY')}
                    headerAction={tradeHeader('BUY')}
                  />
                </div>
                <div className="flex-1 min-w-0 overflow-hidden">
                  <TradesTable
                    title={t('table.sell')}
                    data={sells}
                    accentColor="red"
                    onEdit={(row) => openTradeModal('SELL', row)}
                    onDelete={(id) => handleTradeDelete(id, 'SELL')}
                    headerAction={tradeHeader('SELL')}
                  />
                </div>
              </div>
            )}
          </>
        )}

        {activeView === 'dividends' && (
          <div className="flex gap-4 items-start">
            <div className="flex-1 min-w-0 overflow-hidden flex flex-col gap-4">
              {dividendsLoading ? (
                <p className="text-gray-400 text-sm">{t('auth.loading')}</p>
              ) : (
                <>
                  <DividendTable
                    data={dividends}
                    onEdit={(row) => {
                      setEditDividend(row)
                      setDividendModalOpen(true)
                    }}
                    onDelete={async (id) => {
                      if (confirm('Delete?')) await removeDividend(id)
                    }}
                    headerAction={
                      <div className="flex items-center gap-2">
                        <UploadButton label="📂" onFile={handleFileUpload} />
                        <Button
                          size="sm"
                          onClick={() => {
                            setEditDividend(null)
                            setDividendModalOpen(true)
                          }}
                        >
                          + {t('table.dividends')}
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
        isOpen={dividendModalOpen}
        onClose={() => {
          setDividendModalOpen(false)
          setEditDividend(null)
        }}
        onSubmit={handleDividendSubmit}
        initial={editDividend}
      />

      <TradeModal
        isOpen={tradeModalOpen}
        type={tradeModalType}
        onClose={() => {
          setTradeModalOpen(false)
          setEditTrade(null)
        }}
        onSubmit={handleTradeSubmit}
        initial={editTrade}
      />
    </div>
  )
}
