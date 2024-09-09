# script.py
import pandas as pd
import sys
import pyodbc as pydc
from datetime import datetime
import numpy as np
import pdb


if len(sys.argv) != 2:
    print("Usage: python script.py UPLOADED_FILE", end="")
    sys.exit(1)

uploaded_file_path = sys.argv[1]
# username = sys.argv[2]


def checkExclusionReason(row, conn):
    query = f'''SELECT * FROM ExclusionReasons WHERE exclusion_reason = '{row['MSP_EXCLUSION_REASON']}' '''
    data = pd.read_sql_query(query, conn)
    if (data['type'] == 'Region').item():
        return (True, 'STC Region 1')
    else:
        return (False, 'STC Governance')


try:
# Read Excel file into a DataFrame
    df = pd.read_excel(uploaded_file_path)
except:
    try:
        df = pd.read_csv(uploaded_file_path)
    except:
        print("Error opening the file", end="")
        sys.exit(1)

# Connect to SQLite database (replace 'your_database.db' with your actual database file)
try:
    oracle_conn_string = 'DRIVER=Oracle in instantclient_19_20;DBQ=10.21.71.140:1522/reportingSVC;UID=dawood;PWD=dawood123'
    oracle_conn = pydc.connect(oracle_conn_string)
    connection_str = ("Driver={SQL Server};"
                      "Server=10.23.65.32;"
                      "Database=INOC;"
                      "UID=sa;"
                      "PWD=BetaHouse123#;")
    conn = pydc.connect(connection_str)
    cursor = conn.cursor()

    for index, row in df.iterrows():
        rtts_query = f'''
                SELECT 
                TXT_TICKETNUMBER,
                CASE SLC_SEVERITY WHEN 50 THEN 'Critical' WHEN 40 THEN 'High' WHEN 30 THEN 'Medium' WHEN 20 THEN 'Low' ELSE 'Memo' END AS SEVERITY,
                TXT_ORIGINATORGROUP,
                TXT_CLEAREDBYGROUP,
                TO_CHAR((TO_TIMESTAMP('1970-01-01 00:00:00' ,'YYYY-MM-DD HH24:MI:SS') + NUMTODSINTERVAL(DAT_CREATEDATE+10800, 'SECOND')),'DD-MM-YYYY HH24:MI:SS') AS CREATEDATE,
                TO_CHAR((TO_TIMESTAMP('1970-01-01 00:00:00' ,'YYYY-MM-DD HH24:MI:SS') + NUMTODSINTERVAL(DAT_CLOSEDATE+10800, 'SECOND')),'DD-MM-YYYY HH24:MI:SS') AS CLOSEDATE,
                TO_CHAR((TO_TIMESTAMP('1970-01-01 00:00:00' ,'YYYY-MM-DD HH24:MI:SS') + NUMTODSINTERVAL(DAT_REPORTEDDATE+10800, 'SECOND')),'DD-MM-YYYY HH24:MI:SS') AS REPORTEDDATE,
                TXT_PREVIOUSPARENTTT,
                TO_CHAR((TO_TIMESTAMP('1970-01-01 00:00:00' ,'YYYY-MM-DD HH24:MI:SS') + NUMTODSINTERVAL(COALESCE(DAT_SERVICEIMPACTSTARTDATE,DAT_CREATEDATE)+10800, 'SECOND')),'DD-MM-YYYY HH24:MI:SS') AS SERVICEIMPACTSTARTDATE,
                TO_CHAR((TO_TIMESTAMP('1970-01-01 00:00:00' ,'YYYY-MM-DD HH24:MI:SS') + NUMTODSINTERVAL(DAT_SERVICEIMPACTENDDATE+10800, 'SECOND')),'DD-MM-YYYY HH24:MI:SS') AS SERVICEIMPACTENDDATE,
                TXT_NODECLASSIFICATION,
                CASE SLC_SERVICEIMPACTED WHEN 30 THEN 'Outage' WHEN 20 THEN 'Degraded' ELSE 'No' END AS SERVICEIMPACTED,
                TXT_NODE,
                TXT_NETWORK,
                TXT_SUBNETWORK,
                TXT_TECHNOLOGY,
                TXT_VENDOR,
                SLC_REGION,
                SLC_DISTRICT,
                SLC_CITY,
                TXT_FAULTAREA,
                TXT_FAULTAREADETAIL,
                TXT_ROOTCAUSE,
                TXT_ROOTCAUSEDETAIL,
                TXT_ABSTRACT,
                TXT_REPAIRDETAILS,
                TO_CHAR((TO_TIMESTAMP('1970-01-01 00:00:00' ,'YYYY-MM-DD HH24:MI:SS') + NUMTODSINTERVAL(DAT_LASTCLEARDATE+10800, 'SECOND')),'DD-MM-YYYY HH24:MI:SS') AS LASTCLEARDATE,
                TXT_PENALTYGROUP,
                TXT_SITEID,
                TXT_SITENAME,
                TXT_WFMSNOTICKETNO,
                TXT_TRANS_INSTALLATIONMETHOD,
                TXT_ORIGINATERDIVISION
                FROM aradmin.RTTS_HPD_TroubleTicket
                WHERE 
                TXT_STATUS = 'Closed'
                AND TXT_TICKETNUMBER = '{row['TICKET_NUMBER']}'
            '''
        rtts_data = pd.read_sql_query(rtts_query, oracle_conn)
        IsRegionInvolved, Exclusion_Status = checkExclusionReason(row, conn)
        check_Date_Data = lambda date_value: datetime.strptime(date_value, '%d-%m-%Y %H:%M:%S').strftime(
            '%Y-%m-%d %H:%M:%S') if date_value else None
        value = (rtts_data.values[0][0], rtts_data.values[0][1], 'International Related', rtts_data.values[0][2],
                 row['Request Type'], row['Restoration Duration'], row['Huawei Hubtime'],
                 rtts_data.values[0][3], 
                 datetime.strptime(rtts_data.values[0][4], '%d-%m-%Y %H:%M:%S').strftime('%Y-%m-%d %H:%M:%S'),
                 datetime.strptime(rtts_data.values[0][5], '%d-%m-%Y %H:%M:%S').strftime('%Y-%m-%d %H:%M:%S'),
                 datetime.strptime(rtts_data.values[0][6], '%d-%m-%Y %H:%M:%S').strftime('%Y-%m-%d %H:%M:%S'),
                 rtts_data.values[0][7],
                 datetime.strptime(rtts_data.values[0][8], '%d-%m-%Y %H:%M:%S').strftime('%Y-%m-%d %H:%M:%S'),
                 check_Date_Data(rtts_data.values[0][9]),
                 rtts_data.values[0][10], rtts_data.values[0][11],
                 rtts_data.values[0][12], rtts_data.values[0][13], rtts_data.values[0][14],
                 rtts_data.values[0][15], rtts_data.values[0][16], rtts_data.values[0][17],
                 rtts_data.values[0][18], rtts_data.values[0][19], rtts_data.values[0][20],
                 rtts_data.values[0][21], rtts_data.values[0][22], rtts_data.values[0][23],
                 rtts_data.values[0][24], rtts_data.values[0][25],
                 datetime.strptime(rtts_data.values[0][26], '%d-%m-%Y %H:%M:%S').strftime('%Y-%m-%d %H:%M:%S'),
                 rtts_data.values[0][27], rtts_data.values[0][28], rtts_data.values[0][29],
                 rtts_data.values[0][30], rtts_data.values[0][31], IsRegionInvolved, row['MSP_EXCLUSION_REASON'],
                 row['MSP_EXCLUSION_HOURS_REQUESTED'], row['MSP_EXCLUSION_REMARKS'],Exclusion_Status)
        sql_query = '''INSERT INTO Transport_Tickets(PR_ID
                        ,Priority
                        ,Domain
                        ,Originator_Group
                        ,Request_Type
                        ,Restore_Duration
                        ,Contractor_Hubtime
                        ,Cleared_Group
                        ,Ticket_Create_Date
                        ,Ticket_Closed_Date
                        ,Reported_Date
                        ,Parent_TT
                        ,Service_Impacted_Start_Date
                        ,Service_Impacted_Finished_Date
                        ,Node_Classification
                        ,Service_Impacted
                        ,Node
                        ,Network
                        ,Sub_Network
                        ,Technology
                        ,Vendor
                        ,Region
                        ,District
                        ,City
                        ,Fault_Area
                        ,Fault_Area_Detail
                        ,Root_Cause
                        ,Root_Cause_Detail
                        ,Abstract
                        ,Repair_Details
                        ,Ticket_Cleared_Date
                        ,Penalty_Group
                        ,Site_ID
                        ,Site_Name
                        ,WFMS_Ticket_Number
                        ,Installation_Method,
                        RegionInvolved,
                        Exclusion_Reason,
                        Exclusion_Time_Requested,
                        Contractor_Remarks,
                        Exclusion_Status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) 
                    '''
        cursor.execute(sql_query, value)

    conn.commit()
    conn.close()
    print("Records inserted successfully!", end="")
except Exception as e:
    print("ERROR: " + str(e), end="")
