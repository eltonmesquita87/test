select * from 
(select distinct pp2.PolicyNumber,bi2.CreateTime from bc_billinginstruction bi2 
	inner join bc_charge c2 on c2.billinginstructionid = bi2.id
	inner join bc_invoiceitem ii2 on ii2.chargeid = c2.id	
	inner join bc_policyperiod pp2 on pp2.id = ii2.policyperiodid
	INNER JOIN BC_POLICY P ON p.id = pp2.policyid	
where pp2.CancelStatus = 3
	AND P.LOBCODE = 10001 
	and c2.policychangetype_gcs <> 'CancelamentoIndenizacaoIntegral_GCS'
and not exists ( select 1  from bc_billinginstruction bi 
	inner join bc_charge c on c.billinginstructionid = bi.id
	inner join bc_invoiceitem ii on ii.chargeid = c.id
	inner join bc_invoice i on i.ID = ii.invoiceid
	inner join bc_policyperiod pp on pp.id = ii.policyperiodid
	where ii.InstallmentNumber = 24 and pp2.PolicyNumber = pp.PolicyNumber
	and bi.Subtype = 4)
	and pp2.PolicyPerEffDate > '2016-06-01 00:00:00'
		and bi2.CreateTime > '<month> 00:00:00'
	and bi2.Subtype = 4--Auto
union all 
select distinct pp2.PolicyNumber,bi2.CreateTime from bc_billinginstruction bi2 
	inner join bc_charge c2 on c2.billinginstructionid = bi2.id
	inner join bc_invoiceitem ii2 on ii2.chargeid = c2.id	
	inner join bc_policyperiod pp2 on pp2.id = ii2.policyperiodid
	INNER JOIN BC_POLICY P ON p.id = pp2.policyid	
where pp2.CancelStatus = 3
AND P.LOBCODE = 10002 --home
and not exists ( select 1  from bc_billinginstruction bi 
	inner join bc_charge c on c.billinginstructionid = bi.id
	inner join bc_invoiceitem ii on ii.chargeid = c.id
	inner join bc_invoice i on i.ID = ii.invoiceid
	inner join bc_policyperiod pp on pp.id = ii.policyperiodid
	where ii.InstallmentNumber = 60 and pp2.PolicyNumber = pp.PolicyNumber
	and bi.Subtype = 4)
	and pp2.PolicyPerEffDate > '2016-06-01 00:00:00'
	and bi2.CreateTime > '<month> 00:00:00'
	and bi2.Subtype = 4	
		) a
where 1=1
