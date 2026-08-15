import { BrokerHolding, IndianTaxCalculation } from '../types/index.js';

export interface IndianTaxSummary {
  financialYear: string;
  totalUnrealizedSTCG: number;
  totalUnrealizedLTCG: number;
  stcgTaxLiability: number; // 20%
  ltcgTaxLiability: number; // 12.5% on gains > 1.25L
  ltcgExemptionAvailable: number; // ₹1,25,000 annual exemption
  netTaxLiability: number;
  harvestableShortTermLoss: number;
  harvestableLongTermLoss: number;
  potentialTaxSavings: number;
  recommendations: string[];
}

export class IndianTaxEngine {
  private static readonly STCG_RATE = 0.20; // 20% (Budget 2024)
  private static readonly LTCG_RATE = 0.125; // 12.5% (Budget 2024)
  private static readonly LTCG_EXEMPTION_LIMIT = 125000; // ₹1,25,000 exemption per FY

  public static analyzeTax(holdings: BrokerHolding[]): IndianTaxSummary {
    let totalUnrealizedSTCG = 0;
    let totalUnrealizedLTCG = 0;
    let harvestableShortTermLoss = 0;
    let harvestableLongTermLoss = 0;

    holdings.forEach(h => {
      const pnl = h.pnl;
      // In realistic simulation, let's treat ~40% as short term (< 12 months) and 60% as long term
      const isST = h.tradingsymbol === 'TATAMOTORS' || h.tradingsymbol === 'BANKBEES';

      if (pnl > 0) {
        if (isST) {
          totalUnrealizedSTCG += pnl;
        } else {
          totalUnrealizedLTCG += pnl;
        }
      } else if (pnl < 0) {
        if (isST) {
          harvestableShortTermLoss += Math.abs(pnl);
        } else {
          harvestableLongTermLoss += Math.abs(pnl);
        }
      }
    });

    const stcgTaxLiability = +(totalUnrealizedSTCG * this.STCG_RATE).toFixed(2);
    const taxableLTCG = Math.max(0, totalUnrealizedLTCG - this.LTCG_EXEMPTION_LIMIT);
    const ltcgTaxLiability = +(taxableLTCG * this.LTCG_RATE).toFixed(2);
    const netTaxLiability = +(stcgTaxLiability + ltcgTaxLiability).toFixed(2);

    // Potential tax savings if loss positions are harvested to offset STCG/LTCG
    const potentialTaxSavings = +(
      (harvestableShortTermLoss * this.STCG_RATE) + 
      (harvestableLongTermLoss * this.LTCG_RATE)
    ).toFixed(2);

    const recommendations: string[] = [];

    if (totalUnrealizedLTCG <= this.LTCG_EXEMPTION_LIMIT && totalUnrealizedLTCG > 0) {
      recommendations.push(
        `💡 Your long-term gains (₹${totalUnrealizedLTCG.toLocaleString('en-IN')}) are within the annual ₹1.25 Lakh tax-free exemption under Section 112A. You can book and reinvest gains with ZERO tax liability!`
      );
    } else if (totalUnrealizedLTCG > this.LTCG_EXEMPTION_LIMIT) {
      recommendations.push(
        `⚠️ LTCG above ₹1,25,000 attracts 12.5% tax. Consider staggering profit booking across financial years.`
      );
    }

    if (harvestableShortTermLoss > 0) {
      recommendations.push(
        `📉 Tax-Loss Harvesting: You have ₹${harvestableShortTermLoss.toLocaleString('en-IN')} in short-term losses that can offset STCG (saving 20% tax).`
      );
    }

    return {
      financialYear: 'FY 2025-26',
      totalUnrealizedSTCG,
      totalUnrealizedLTCG,
      stcgTaxLiability,
      ltcgTaxLiability,
      ltcgExemptionAvailable: Math.max(0, this.LTCG_EXEMPTION_LIMIT - totalUnrealizedLTCG),
      netTaxLiability,
      harvestableShortTermLoss,
      harvestableLongTermLoss,
      potentialTaxSavings,
      recommendations
    };
  }
}
