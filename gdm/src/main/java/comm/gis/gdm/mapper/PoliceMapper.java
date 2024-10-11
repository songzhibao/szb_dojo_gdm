package comm.gis.gdm.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import comm.gis.gdm.module.police.domain.*;

import java.util.*;

@Mapper
public interface PoliceMapper {

    @Select("<script> select * from gdm_view_police where 1=1 ${sqlcondition}  </script>")
    List<PoliceInfoEntity> selectPoliceInfoList(String sqlcondition);

    @Select("<script> select typeid,typecode,typename,onlinestatus,count(typeid) typecount from gdm_view_police where 1=1 ${sqlcondition}  group by typeid,typecode,typename,onlinestatus  </script>")
    List<Map<String, Object>> selectPoliceTypeStatList(String sqlcondition);

    @Select("<script> select statusid,statuscode,statusname,onlinestatus,count(statusid) statuscount from gdm_view_police where 1=1 ${sqlcondition}  group by statusid,statuscode,statusname,onlinestatus  </script>")
    List<Map<String, Object>> selectPoliceStatusStatList(String sqlcondition);

    @Select("<script> select orgid,orgcode,orgname,onlinestatus,count(orgid) orgCount from gdm_view_police  where 1=1 ${sqlcondition}  group by orgid,orgcode,orgname,onlinestatus,onlinestatus  </script>")
    List<Map<String, Object>> selectPoliceOrgStatList(String sqlcondition);

    @Select("<script> select typeid,typecode,typename,orgid,onlinestatus,count(typeid) typecount from gdm_view_police where 1=1 ${sqlcondition}  group by typeid,typecode,typename,orgid,onlinestatus  </script>")
    List<Map<String, Object>> selectPoliceTypeOrgStatList(String sqlcondition);

    @Update(" update gdm_gis_member set duty_status=#{statusCode},duty_status_label=#{markName} where id in (select member_id from gdm_gis_device_member where device_id in (select id from gdm_gis_device where code = #{deviceCode})) ")
    Integer updateDutyStatusMark(String statusCode, String markName, String deviceCode);
}
