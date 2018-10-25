select distinct pp.policynumber, bi.createtime , ii.InstallmentNumber
from bc_invoice i 
inner join bc_invoiceitem ii  on ii.InvoiceID = i.id
inner join bc_policyperiod pp on pp.id = ii.PolicyPeriodID
inner join bc_charge c on c.id = ii.ChargeID 
inner join bc_billinginstruction bi on bi.id = c.BillingInstructionID
inner join bcx_invoiceitemcoverages_gcs iic on iic.InvoiceItemID = ii.id
inner join bcx_covitem_gcs ci on ci.id = iic.CovItem_GCSID
inner join bcx_coveragepolicychange_gcs cpc on cpc.InvoiceItemCoveragesID = iic.id
INNER JOIN BC_POLICY P with (nolock) ON p.id = pp.policyid
where ii.retired = 0
and pp.CancelStatus <> 3
and bi.subtype = 1
and iic.deltaTaxesCost = 0
and iic.deltanetpremium <> 0
and ci.CoverageCategory_GCS = 'Coberturas'
and ii.InstallmentNumber < 24
and p.lobcode = 10001
and bi.createtime >= '<month> 00:00:00'
and cpc.DeltaTaxesCost <> 0
and exists (select 1 from bc_charge c3
                     inner join bc_chargepattern cp3 with (nolock) on cp3.id = c3.ChargePatternID
                     inner join bc_invoiceitem ii3 on ii3.chargeid = c3.id
                     where c3.BillingInstructionID = bi.id 
                     and cp3.ChargeCode <> 'Premium' 
                     and ii3.InstallmentNumber = ii.InstallmentNumber)
and not exists(select 1 
                from bc_invoiceitem ii2 
                inner join bc_charge c2 on c2.id = ii2.ChargeID
                 inner join bc_chargepattern cp2 with (nolock) on cp2.id = c2.ChargePatternID
                where c2.BillingInstructionID = bi.id
                and cp2.ChargeCode <> 'Premium'
                and ii.InstallmentNumber + 1 = ii2.InstallmentNumber) 

