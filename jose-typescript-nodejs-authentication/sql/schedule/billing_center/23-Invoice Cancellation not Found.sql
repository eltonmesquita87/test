select distinct pp.PolicyNumber,ii.InstallmentNumber 
from  bc_invoiceitem ii
inner join bc_policyperiod pp on pp.id = ii.PolicyPeriodID 
inner join bc_invoice i on i.id = ii.invoiceid
inner join bc_charge c on c.id = ii.ChargeID
inner join bc_billinginstruction bi on bi.id = c.BillingInstructionID
inner join bc_billinginstruction bi2 on bi2.AssociatedPolicyPeriodID = pp.id
where not exists 
	(select 1 from <policycenter>.dbo.pcx_invoicecancellation_gcs ic 
	where ic.InstallmentNumber = ii.InstallmentNumber and ic.PolicyNumber = pp.PolicyNumber and i.InvoiceNumber = ic.InvoiceNumber)
and not exists
	(select 1 from bc_basedistitem bdi inner join bc_basedist bd on bdi.ActiveDistID = bd.id
				   inner join bc_basemoneyreceived bmr on bmr.basedistid = bd.id
	where bdi.invoiceitemid = ii.id and bmr.subtype in (3,4))
and pp.CancelStatus = 3
and i.EndorsementNumber_GCS is not null
and bi2.CreateTime >= '<month> 00:00:00'
and ii.amount > 0
and bi2.subtype = 4
and pp.policynumber <> '5009110003405'
and bi.subtype = 5
