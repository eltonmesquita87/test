SELECT DISTINCT pp.PolicyNumber, m.ErrorDescription 
  FROM pc_message m 
 INNER JOIN pc_policyperiod pp  on m.policyperiodid = pp.id
 WHERE m.destinationid = 66 AND m.status != 1
