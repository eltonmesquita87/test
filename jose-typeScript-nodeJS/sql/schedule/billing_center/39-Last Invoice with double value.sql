select distinct pp.PolicyNumber, bi.CreateTime
from bc_invoice i 
inner join bc_invoiceitem ii on ii.invoiceid = i.ID
inner join bcx_invoiceitemcoverages_gcs iic on iic.InvoiceItemID = ii.ID
inner join bcx_covitem_gcs ci on ci.id = iic.CovItem_GCSID
inner join bc_policyperiod pp on pp.id = ii.PolicyPeriodID
inner join bc_charge c on c.id = ii.ChargeID

inner join bc_billinginstruction bi on bi.id = c.BillingInstructionID
inner join bc_invoiceitem ii2 on ii2.PolicyPeriodID = pp.id
inner join bcx_invoiceitemcoverages_gcs iic2 on iic2.InvoiceItemID = ii2.ID and iic2.covitem_gcsid = iic.covitem_gcsid
where bi.subtype = 1
and iic.DeltaNetPremium > 0
and ci.coveragecategory_gcs = 'Coberturas'	
and (iic2.DeltaNetPremium > 0.23 or iic2.DeltaNetPremium = 0 or iic2.DeltaNetPremium < -0.23)
and ii.InstallmentNumber = 24
and ii2.InstallmentNumber = 23
and pp.PolicyNumber like '500311%'
and pp.CancelStatus <> 3
and bi.CreateTime > '2018-01-31 23:59:59'
and iic2.DeltaNetPremium*2 <= iic.DeltaNetPremium







