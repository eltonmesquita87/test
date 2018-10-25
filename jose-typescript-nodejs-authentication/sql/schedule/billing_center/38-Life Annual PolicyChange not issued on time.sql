select distinct pp.policynumber from bc_policyperiod pp 
INNER JOIN BC_POLICY P ON p.id = pp.policyid
where not exists(select 1 from bc_billinginstruction bi 
inner join bc_charge c on c.BillingInstructionID = bi.ID
inner join bc_invoiceitem ii on ii.chargeid = c.ID
where ii.PolicyPeriodID = pp.id
and bi.subtype = 1)
AND P.LOBCODE = 10004
and CAST(pp.PolicyPerEffDate AS DATE) <= CAST(GetDate() - 356 AS DATE)
and not exists (select 1 from <policycenter>.dbo.pc_job j inner join <policycenter>.dbo.pc_policyperiod p on p.jobid = j.id 
                where j.subtype = 2 and p.status = 9 and p.PolicyNumber = pp.PolicyNumber)
and pp.PolicyPerEffDate > '2017-04-22 23:59:59'
