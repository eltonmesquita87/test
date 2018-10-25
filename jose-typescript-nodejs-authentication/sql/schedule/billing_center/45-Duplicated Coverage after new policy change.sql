select distinct policynumber
from
( select
    pp.PolicyNumber,
     ii.InstallmentNumber,
	iic.removed,        
    ci.CoverageID,
    cpc.PolicyChangeType_GCS,
    bi.id,
    count(1) as 'qtd'
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
where 1=1 
    and bi.Subtype in (1)
    and cp.chargeCode = 'Premium'
    and ivc.retired = 0 
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
group by pp.policynumber,iic.removed, cpc.PolicyChangeType_GCS, ii.InstallmentNumber, ci.CoverageID, bi.id
having count(1) > 1) a 
where 1=1 
