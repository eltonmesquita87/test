select distinct pp.policynumber from(
select invoice, count(1) qtd
from (
(select distinct i.ID invoice,bmr.id from bc_basemoneyreceived bmr
inner join bc_basedist bd on bmr.basedistid = bd.id
inner join bc_basedistitem bdi on bdi.activedistid = bd.id
inner join bc_invoiceitem ii on ii.id = bdi.invoiceitemid
inner join bc_invoice i on i.id = ii.invoiceid
where bmr.Subtype in (3,4)
and bmr.CreateTime > '<month> 00:00:00'
and bmr.Retired = 0
and bdi.Retired = 0
and bmr.ReversalDate is null
and ii.Retired = 0)) a
group by a.invoice
having COUNT(1) > 1) b 
inner join bc_invoiceitem ii2 on ii2.InvoiceID = b.invoice
inner join bc_policyperiod pp on pp.ID = ii2.PolicyPeriodID
where pp.PolicyNumber != 5003110090564
and pp.cancelstatus <> 3
