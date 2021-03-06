select * from
(select policynumber, paymentrequest,count(invoiceitem ) as 'qtd'
from (
select pp.PolicyNumber,p.ID PaymentRequest,ii.id InvoiceItem from bc_billinginstruction bi 
	inner join bc_charge c on c.billinginstructionid = bi.id
	inner join bc_invoiceitem ii on ii.chargeid = c.id
	inner join bc_invoice i on i.ID = ii.invoiceid
	inner join bc_policyperiod pp on pp.id = ii.policyperiodid
	INNER JOIN BC_POLICY po ON po.id = pp.policyid
	inner join bc_paymentrequest p on p.invoiceid = i.id
where pp.CancelStatus = 3
and bi.Subtype = 4
and p.Retired = 0
AND po.LOBCODE = 10004
and p.createtime >= '<month> 00:00:00'
and pp.PolicyPerEffDate > '2016-06-01 00:00:00') a
group by  policynumber,paymentrequest
having count(invoiceitem ) > 2) a
where 1=1

