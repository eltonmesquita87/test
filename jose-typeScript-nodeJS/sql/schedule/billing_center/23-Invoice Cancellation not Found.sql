
select distinct pp.PolicyNumber,ii.InstallmentNumber 
from  bc_invoiceitem ii
inner join bc_policyperiod pp on pp.id = ii.PolicyPeriodID 
inner join bc_invoice i on i.id = ii.invoiceid
inner join bc_charge c on c.id = ii.ChargeID
inner join bc_billinginstruction bi on bi.id = c.BillingInstructionID
where not exists 
	(select 1 from <policycenter>.dbo.pcx_invoicecancellation_gcs ic 
	where ic.InstallmentNumber = ii.InstallmentNumber and ic.PolicyNumber = pp.PolicyNumber and i.InvoiceNumber = ic.InvoiceNumber)
and not exists
	(select 1 from bc_basedistitem bdi inner join bc_basedist bd on bdi.ActiveDistID = bd.id
				   inner join bc_basemoneyreceived bmr on bmr.basedistid = bd.id
	where bdi.invoiceitemid = ii.id and bmr.subtype in (3,4))
and exists
	(select 1 from <policycenter>.dbo.pc_policyperiod pp2 inner join <policycenter>.dbo.pc_job j on j.id = pp2.jobid
	where pp2.status = 9 and j.subtype = 4 and pp2.policynumber = pp.PolicyNumber and pp2.WrittenDate > '2017-01-01 00:00:00') 
and pp.CancelStatus = 3
and i.EndorsementNumber_GCS is not null
and ii.amount > 0
and pp.policynumber <> '5009110003405'
and bi.subtype = 5
