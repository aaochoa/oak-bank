import React, { useState } from 'react';
import { useBank } from '../context/BankContext';
import { BankCard } from '../types';
import { 
  CreditCard, 
  Lock, 
  Unlock, 
  Eye, 
  EyeOff, 
  RotateCcw, 
  Sliders, 
  Globe, 
  Wifi, 
  ShieldCheck, 
  Plus, 
  Sparkles,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const CardManagementView: React.FC = () => {
  const { 
    cards, 
    toggleCardFreeze, 
    updateCardLimit, 
    toggleCardSetting,
    showToast 
  } = useBank();

  const [selectedCardId, setSelectedCardId] = useState<string>(cards[0]?.id || '');
  const [isFlipped, setIsFlipped] = useState(false);
  const [showSensitiveDetails, setShowSensitiveDetails] = useState(false);
  const [limitSlider, setLimitSlider] = useState<number>(cards[0]?.spendingLimit || 25000);

  const currentCard = cards.find(c => c.id === selectedCardId) || cards[0];

  const handleCardSelect = (card: BankCard) => {
    setSelectedCardId(card.id);
    setIsFlipped(false);
    setShowSensitiveDetails(false);
    setLimitSlider(card.spendingLimit);
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setLimitSlider(val);
  };

  const handleLimitCommit = () => {
    updateCardLimit(currentCard.id, limitSlider);
  };

  const isFrozen = currentCard.status === 'frozen';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-500" />
            <span>Card Portfolio & Controls</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage physical titanium cards and instant virtual merchant tokens
          </p>
        </div>

        <button
          onClick={() => showToast('Virtual Card Issued', 'New virtual commercial debit card created and ready for Apple Pay.')}
          className="self-start sm:self-center flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Issue Virtual Card</span>
        </button>
      </div>

      {/* Main Grid: Card Visualizer + Card Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Card Selector & 3D Interactive Card */}
        <div className="lg:col-span-7 space-y-5">
          {/* Card Carousel Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {cards.map(card => {
              const isSelected = card.id === selectedCardId;
              return (
                <button
                  key={card.id}
                  onClick={() => handleCardSelect(card)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                    isSelected
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-md'
                      : 'bg-white dark:bg-[#121820] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${card.status === 'frozen' ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                    <span>{card.tier} (••• {card.last4})</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* 3D Flippable Bank Card */}
          <div className="relative perspective-1000 max-w-md mx-auto w-full h-64 select-none">
            <div 
              className={`w-full h-full rounded-3xl p-6 shadow-2xl transition-all duration-700 relative overflow-hidden flex flex-col justify-between ${
                currentCard.theme === 'emerald'
                  ? 'bg-gradient-to-tr from-[#062417] via-[#0b3b27] to-[#12583b] text-white border border-emerald-400/30'
                  : currentCard.theme === 'obsidian'
                  ? 'bg-gradient-to-tr from-[#0a0a0c] via-[#16161c] to-[#252530] text-white border border-slate-700/60'
                  : 'bg-gradient-to-tr from-[#2a1e05] via-[#4a3508] to-[#78540d] text-amber-100 border border-amber-500/30'
              } ${isFrozen ? 'opacity-70 grayscale-[50%]' : ''}`}
            >
              {/* Frozen Overlay */}
              {isFrozen && (
                <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center text-center p-4">
                  <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 mb-2">
                    <Lock className="w-6 h-6" />
                  </div>
                  <p className="font-bold text-sm text-white">CARD CURRENTLY FROZEN</p>
                  <p className="text-xs text-slate-300 mt-0.5">All contactless and online authorizations blocked</p>
                </div>
              )}

              {/* Watermark Logo / Metallic chip */}
              {!isFlipped ? (
                /* Card Front */
                <>
                  <div className="flex items-start justify-between relative z-10">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold tracking-wider text-sm">OAK BANK</span>
                        <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-white/10 backdrop-blur-sm border border-white/15">
                          {currentCard.tier}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-300 tracking-wider uppercase mt-0.5">
                        {currentCard.type}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Wifi className="w-5 h-5 text-white/80 rotate-90" />
                      <Sparkles className="w-4 h-4 text-amber-300" />
                    </div>
                  </div>

                  {/* EMV Chip */}
                  <div className="w-11 h-8 rounded-md bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-300 border border-amber-600/40 shadow-inner flex items-center justify-center">
                    <div className="w-8 h-5 border border-amber-800/40 rounded-sm grid grid-cols-2 gap-0.5" />
                  </div>

                  {/* Card Number */}
                  <div className="space-y-1 relative z-10">
                    <div className="font-mono text-lg sm:text-xl tracking-[0.2em] font-semibold text-slate-100 drop-shadow">
                      {showSensitiveDetails 
                        ? `4532 8920 1849 ${currentCard.last4}` 
                        : `•••• •••• •••• ${currentCard.last4}`}
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-slate-400 block">Cardholder</span>
                        <span className="font-bold tracking-wider text-xs">{currentCard.cardholderName}</span>
                      </div>

                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-slate-400 block">Expires</span>
                        <span className="font-mono font-bold tracking-wider text-xs">{currentCard.expiryMonth}/{currentCard.expiryYear}</span>
                      </div>

                      <div className="text-right">
                        <span className="text-[9px] uppercase tracking-wider text-slate-400 block">CVV</span>
                        <span className="font-mono font-bold tracking-wider text-xs">{showSensitiveDetails ? currentCard.cvv : '•••'}</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                /* Card Back */
                <div className="h-full flex flex-col justify-between relative z-10 py-1">
                  <div className="w-full h-10 bg-black/80 -mx-6 mb-2" />
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between bg-white/90 text-slate-900 px-3 py-1.5 rounded font-mono text-xs">
                      <span className="text-[10px] text-slate-500">AUTHORIZED SIGNATURE</span>
                      <span className="font-bold text-sm tracking-widest">{currentCard.cvv}</span>
                    </div>
                    <p className="text-[9px] text-slate-300 leading-tight">
                      Issued by Oak Bank Member FDIC under license from Visa International. Card is property of Oak Bank.
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2">
                    <span className="text-[10px] font-mono text-slate-300">24/7 Concierge: +1 (800) 849-OAK</span>
                    <span className="font-bold">{currentCard.brand}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Controls Bar */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Flip Card ({isFlipped ? 'Front' : 'Back'})</span>
            </button>

            <button
              onClick={() => setShowSensitiveDetails(!showSensitiveDetails)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              {showSensitiveDetails ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showSensitiveDetails ? 'Mask Details' : 'Show CVV & Digits'}</span>
            </button>

            <button
              onClick={() => toggleCardFreeze(currentCard.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isFrozen
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  : 'bg-rose-500/15 hover:bg-rose-500/25 text-rose-500 border border-rose-500/30'
              }`}
            >
              {isFrozen ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
              <span>{isFrozen ? 'Unlock Card' : 'Freeze Card'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Security Preferences & Limit Controls */}
        <div className="lg:col-span-5 space-y-5">
          {/* Monthly Spending Limit Slider */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#121820] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-emerald-500" />
                  <span>Monthly Spending Cap</span>
                </h3>
                <p className="text-xs text-slate-400">Hard limit on debit authorizations</p>
              </div>

              <span className="font-mono text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                ${limitSlider.toLocaleString()}
              </span>
            </div>

            <input
              type="range"
              min="1000"
              max="100000"
              step="1000"
              value={limitSlider}
              onChange={handleLimitChange}
              onMouseUp={handleLimitCommit}
              onTouchEnd={handleLimitCommit}
              className="w-full accent-emerald-500 h-2 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer"
            />

            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>$1,000 min</span>
              <span>Current Spent: ${currentCard.currentSpent.toLocaleString()}</span>
              <span>$100,000 max</span>
            </div>
          </div>

          {/* Security Permissions Toggle List */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#121820] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Security & Payment Rails
            </h3>

            <div className="space-y-3">
              {/* Contactless / Apple Pay */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    <Wifi className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-900 dark:text-white">Contactless & Apple Pay</p>
                    <p className="text-[11px] text-slate-400">Allow NFC tap and digital wallet payments</p>
                  </div>
                </div>

                <button
                  onClick={() => toggleCardSetting(currentCard.id, 'isContactless')}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    currentCard.isContactless ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    currentCard.isContactless ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* International Payments */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-900 dark:text-white">International Transactions</p>
                    <p className="text-[11px] text-slate-400">Global travel & cross-border merchant billing</p>
                  </div>
                </div>

                <button
                  onClick={() => toggleCardSetting(currentCard.id, 'isInternationalEnabled')}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    currentCard.isInternationalEnabled ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    currentCard.isInternationalEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

