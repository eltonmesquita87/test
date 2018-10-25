select pp.policynumber, pp.writtendate, j.jobnumber, pp.id policyperiodid 
from pc_policyperiod pp inner join pc_job j on j.id = pp.jobid
inner join pc_policy p on p.id = pp.policyid
where modeldate is null
and p.ProductCode = 'AAHAandH'
and status = 9
and j.subtype = 4
and (pp.retired = 0 and j.retired = 0)
and pp.createtime >= '<month> 00:00:00'
