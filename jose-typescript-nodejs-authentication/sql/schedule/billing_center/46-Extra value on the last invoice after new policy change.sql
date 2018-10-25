select
    distinct pp.PolicyNumber
    ,ci.CoverageID,
    bi.CreateTime,
    iic.NetPremium as 'NetPremium Parcela 24',
    iic.TaxesCost as 'TaxeCost Parcela 24',
    iic2.NetPremium as 'NetPremium Parcela 23',
    iic2.TaxesCost as 'Taxescost Parcela 23'
from bc_invoice ivc with (nolock)
        left join bctl_invoicestatus ivcs with (nolock) on ivc.status = ivcs.id
    inner join bc_invoiceitem ii with (nolock) on ii.invoiceId = ivc.id
    inner join bc_policyperiod pp with (nolock) on pp.id = ii.PolicyPeriodID
    inner join bc_charge cg with (nolock) on cg.id = ii.chargeId
            inner join bc_chargepattern cp with (nolock) on cp.id = cg.ChargePatternID
    inner join bc_billinginstruction bi with (nolock) on cg.BillingInstructionID = bi.id 
                left join bctl_billinginstruction bitl with (nolock) on bi.subtype = bitl.id
    inner join bcx_covitem_gcs ci with (nolock) on ci.CovContainer_GCS = cg.CovContainer_GCS
    inner join bcx_invoiceitemcoverages_gcs iic with (nolock) on iic.CovItem_GCSID = ci.id and iic.InvoiceItemID = ii.id and iic.chargeId = cg.id
    inner join bcx_coveragepolicychange_gcs cpc on cpc.invoiceitemcoveragesid = iic.id
    inner join bc_invoiceitem ii2 with (nolock) on ii.ChargeID = ii2.ChargeID
    inner join bcx_invoiceitemcoverages_gcs iic2 with (nolock) on iic2.CovItem_GCSID = ci.id and iic2.InvoiceItemID = ii2.id and iic2.chargeId = cg.id
    inner join bcx_coveragepolicychange_gcs cpc2 on cpc2.invoiceitemcoveragesid = iic2.id  and cpc2.PolicyChangeType_GCS = cpc.PolicyChangeType_GCS
where 1=1 
    and ii.installmentNumber = 24
    and ii2.InstallmentNumber = 23
    and (not ((iic.NetPremium - iic2.NetPremium) between -15 and 15)
    or not ((iic.TaxesCost - iic2.TaxesCost) between -15 and 15))
    and bi.Subtype in (1)
    and cp.chargeCode = 'Premium'
    and ivc.retired = 0 
    and cpc.retired = 0
    and cpc2.retired = 0
    and iic2.retired = 0    
    and ii.retired = 0 
    and ii.reversed = 0 
    and pp.retired = 0
    and cp.retired = 0
    and isNull(bitl.retired,0) = 0
    and ci.retired = 0
    and bi.CreateTime > '<month> 00:00:00'
    and iic.retired = 0
    and cg.reversed = 0
	and cp.ChargeCode = 'Premium'

