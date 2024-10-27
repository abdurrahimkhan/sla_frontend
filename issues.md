- user request API:
permissions are not being set while creating user

-exclusion reason:
when spoc submits the tt, backend checks the region string in the ER although it does not exist therefore it
sends it to NOC by default.

:frontend:
pending and view if typed in url, it opens up.

<!-- spocvalidationDTO -->
@ApiProperty({ type: String, minLength: 8, maxLength: 255 })
  noc_remarks: string;


---------------------------------
1:
fetch-all in exclusion should pass a value, SPM only or NOC only etc.

2:
Hua NOC & SPOC Final
rank can be SPOC or NOC but Tanveer has both rights.

3:
GOV rejects - hua_district and hua_department column should also be DISPUTE

4: when spoc returns, the E_R disappears

5:
 E_request time should not exceed total,

 6: 
 spoc submits to dispute endpoint
 action me Dispute bejhna ha

 7:
 STC_Regional_Final_Acceptance should save yes/no instead of 1/0

 8:
 close option not available. TT cannot be closed.
 hua-noc-handler API
 partial acceptance API


 9:
 spoc to spm point not available. how to return tt from spoc to spm.
var of T/F spm

 10:
 call full view endpoint in the all ticket table

 11:
 from sidebar, the # doesnt get set, from home, the hash gets set.
 

 12:
 get rank field of the user while logging in [for leveling the div component in the process tt page]

 13:
 split SPM Tt from others in the regional level. ala and kassum

 14: 
 for MSAN cases, how to deal with them ? 

 15:

 CIC remarks should be float
 STC_Regional_Final_Acceptance varchar ? 


 16: 
 ptl, mttr should be float

 17: 
 get users all data after success login.

 18:
 domain based tts, where mc is not involved

 19:
 get only failed tickets.