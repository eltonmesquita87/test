select * from
(select distinct a.policynumber
from  
(select pp.policynumber,pp.WrittenDate,j.PolicyChangeType_GCS,j.id
from pc_policyperiod pp inner join pc_job j on j.id = pp.jobid and j.retired = 0 and pp.status = 9) a 
inner join 
(select pp.policynumber,pp.WrittenDate,j.PolicyChangeType_GCS,j.id from pc_policyperiod pp
inner join pc_job j on j.id = pp.jobid where j.Retired = 0 and pp.status = 9) b on a.policynumber = b.policynumber
and a.WrittenDate = b.WrittenDate and a.PolicyChangeType_GCS = b.PolicyChangeType_GCS and a.id <> b.id
where a.PolicyChangeType_GCS in (10029,10030)) c
where 1=1
