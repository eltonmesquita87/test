select pp.policynumber, pp.writtendate, j.jobnumber, pp.id policyperiodid 
from pc_policyperiod pp inner join pc_job j on j.id = pp.jobid
where modeldate is null
and policynumber like '500911%'
and status = 9
and j.subtype = 4
and (pp.retired = 0 and j.retired = 0)
and pp.writtendate > '2017-12-14 00:00:00'
