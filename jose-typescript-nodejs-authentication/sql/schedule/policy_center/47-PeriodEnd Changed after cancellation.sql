select * from (select distinct pp.policynumber, pp.PeriodEnd
from pc_policyperiod pp 
inner join pc_job j on j.id = pp.jobid
inner join pc_policyperiod pp2 on pp.PolicyNumber = pp2.PolicyNumber 
inner join pc_job j2 on j2.id = pp2.jobid
and convert(date, pp.PeriodEnd, 104) != convert(date, pp2.PeriodEnd, 104)
where pp.status = 9 and pp2.status = 9
and pp.retired = 0
and pp2.retired = 0
and j.subtype = 9
and j2.subtype = 2
and pp.policynumber <> 5003110042316) a 
where 1 = 1 
