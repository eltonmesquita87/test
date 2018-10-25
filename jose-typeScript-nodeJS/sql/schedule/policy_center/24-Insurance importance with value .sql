select distinct pp2.policynumber, pvc2.PatternCode
from pc_personalvehiclecov pvc2 inner join pc_policyperiod pp2 on pp2.id = pvc2.branchid
INNER JOIN pc_job job2 ON job2.ID = pp2.JobID
where job2.subtype <> 9 and pp2.status = 9
and pp2.WrittenDate > '2017-01-01 00:00:00'
and (pvc2.DirectTerm1  < 1 or pvc2.DirectTerm2 < 1)
