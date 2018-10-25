select distinct pp.PolicyNumber, ii.installmentnumber
from bc_policyperiod pp 
inner join bc_invoiceitem ii on pp.id = ii.PolicyPeriodID
inner join bc_invoice i on i.ID = ii.InvoiceID
where ii.retired = 0
and pp.retired = 0	
and ii.retired = 0
and not exists
(select 1
	from bc_billinginstruction bi 
	where bi.associatedpolicyperiodid = pp.id 
	and bi.subtype = 4) 
and exists (select 1 from <policycenter>.dbo.pc_job j
inner join <policycenter>.dbo.pc_policyperiod pp2 on j.id = pp2.jobid
where j.retired = 0
and pp2.retired = 0
and i.eventdate >= '<month> 00:00:00'
and j.jobnumber = i.EndorsementNumber_GCS
and pp2.status not in (9, 3))
