package comm.gis.gdm.mapper;

import java.sql.Timestamp;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;

import comm.gis.gdm.common.domain.StatInfoEntity;
import comm.gis.gdm.module.caseinfo.domain.*;

@Mapper
public interface CaseMapper extends BaseMapper<CaseInfoEntity> {

    @Select("<script>  select info.id, info.case_code caseCode, case_address address, case_time, case_detailedinfo as detailedInfo, info.case_type typeCode, tt.name as typeName, info.case_type_l1 mainTypeCode, mt.name mainTypeName, duty_orgid orgId, o.name orgName, info.lon, info.lat, info.case_level levelCode, info.update_time updateTime from gdm_CASE_CASEINFO info left join gdm_DIC_CASETYPE mt on info.case_type_l1 = mt.id left join gdm_DIC_CASETYPE tt on info.case_type = tt.id left join gdm_sys_organization o on info.duty_orgid = o.id ${sqlcondition} </script>")
    List<CaseInfoEntity> getCaseInfoByCondition(String sqlcondition);

    @Select("<script> select count(*) count, info.duty_orgid id ,info.duty_orgname \"name\" from gdm_case_caseinfo_assemble info where info.valid = 1 and info.deleted = 0 ${sqlcondition} group by info.duty_orgid,info.duty_orgname </script>")
    List<StatInfoEntity> getCaseStatForOrgByCondition(String sqlcondition);

    @Select("<script> select mmm.*,nnn.order_number from (select aa.id,aa.name,aa.parent_id,aa.counts,bb.counts as counts_tb,cc.counts as counts_hb,aa.casetype_level from ( select b1.id, b1.name,b1.parent_id,b1.casetype_level, count(a1.case_type) counts  from gdm_DIC_CASETYPE b1 left join (select * from gdm_CASE_CASEINFO q1  where q1.case_time>= timestamp '${startTime}' and q1.case_time &lt; timestamp '${endTime}' ${sqlcondition}) a1 on b1.id =a1.case_type group by a1.case_type, b1.id, b1.name,b1.parent_id,b1.casetype_level) aa , ( select b2.id, b2.name,b2.parent_id,b2.casetype_level, count(a2.case_type) counts  from gdm_DIC_CASETYPE b2 left join (select * from gdm_CASE_CASEINFO q2  where q2.case_time>= timestamp '${startTime}' + '-1 year' and q2.case_time &lt; timestamp '${endTime}' + '-1 year' ${sqlcondition}) a2 on b2.id=a2.case_type group by a2.case_type, b2.id, b2.name,b2.parent_id,b2.casetype_level) bb , ( select b3.id, b3.name,b3.parent_id,b3.casetype_level, count(a3.case_type) counts  from gdm_DIC_CASETYPE b3 left join (select * from gdm_CASE_CASEINFO q3  where q3.case_time>= timestamp '${startTime}' + '-1 month' and q3.case_time &lt; timestamp '${endTime}' + '-1 month' ${sqlcondition}) a3 on b3.id=a3.case_type group by a3.case_type, b3.id, b3.name,b3.parent_id,b3.casetype_level ) cc  where aa.id=bb.id and aa.id=cc.id )  mmm left join gdm_DIC_CASETYPE nnn on mmm.id=nnn.id order by nnn.order_number </script>")
    List<CaseSumEntity> getCaseTypeCount(Timestamp startTime, Timestamp endTime, String sqlcondition);

    @Select("<script> select tt.hh id,aa.counts,bb.counts as counts_tb,cc.counts as counts_hb from (SELECT unnest(string_to_array('00,01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23',',')) hh) as tt left join ( select to_char(a1.case_time,'hh24') hh, count(to_char(a1.case_time,'hh24')) counts  from (select * from gdm_CASE_CASEINFO q1  where q1.case_time>= timestamp '${startTime}' and q1.case_time &lt; timestamp '${endTime}' ${sqlcondition} ) a1 group by to_char(a1.case_time,'hh24')) aa on tt.hh = aa.hh left join ( select to_char(a2.case_time,'hh24') hh, count(to_char(a2.case_time,'hh24')) counts  from (select * from gdm_CASE_CASEINFO q2  where q2.case_time>= timestamp '${startTime}' + '-1 year' and q2.case_time &lt; timestamp '${endTime}' + '-1 year' ${sqlcondition} ) a2 group by to_char(a2.case_time,'hh24')) bb on tt.hh =bb.hh left join ( select to_char(a3.case_time,'hh24') hh, count(to_char(a3.case_time,'hh24')) counts  from (select * from gdm_CASE_CASEINFO q3  where q3.case_time>= timestamp '${startTime}' + '-1 month' and q3.case_time &lt; timestamp '${endTime}' + '-1 month' ${sqlcondition}  ) a3 group by to_char(a3.case_time,'hh24') ) cc on tt.hh =cc.hh  </script>")
    List<CaseSumEntity> getCaseFor24Line(Timestamp startTime, Timestamp endTime, String sqlcondition);
}
