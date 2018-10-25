select distinct pp.policynumber, ii.installmentnumber 
from bc_invoiceitem ii 
	inner join bc_invoice i on i.id = ii.invoiceid 
	inner join bc_policyperiod pp on pp.id = ii.policyperiodid
	inner join (select bdi.* from bc_basedistitem bdi
	inner join bc_basedist bd on bd.id = bdi.activedistid 
	inner join bc_basemoneyreceived bmr on bmr.basedistid = bd.id 
	where bmr.subtype in (3,4) and bdi.createtime > '2016-06-01 00:00:00') bdi on bdi.invoiceitemid = ii.id
where i.status = 3
and pp.cancelstatus <> 3
and pp.policynumber like '500911%'
