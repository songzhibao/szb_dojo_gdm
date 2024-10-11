package comm.gis.gdm.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;

import comm.gis.gdm.module.system.domain.OrgInfoEntity;

@Mapper
public interface OrganizationMapper extends BaseMapper<OrgInfoEntity> {

        @Select({
                        "<script>",
                        "with recursive r as (select id,type_id,code,name,level,pid,order_number from gdm_sys_organization where valid = 1 and id in ",
                        "<foreach collection='orgIds' item='orgid' open='(' separator=',' close=')'>",
                        "#{orgid}",
                        "</foreach>",
                        " union all select o.id,o.type_id,o.code,o.name,o.level, o.pid,o.order_number from gdm_sys_organization o join r on r.id = o.pid where valid = 1) select id,id orgId,type_id,code,name,level orgLevel,pid parent,order_number  from r </script>"
        })
        List<OrgInfoEntity> selectOrgInfos(List<String> orgIds);

        @Select({
                        "<script>",
                        " select id,name,(select string_agg(code,',') from gdm_sys_organization s where s.pid=o.id) childCode from gdm_sys_organization o where pid in ",
                        "<foreach collection='orgIds' item='orgid' open='(' separator=',' close=')'>",
                        "#{orgid}",
                        "</foreach>",
                        " order by order_number </script>"
        })
        List<Map<String, Object>> selectChildOrgListWithCodes(List<String> orgIds);

        @Select({
                        "<script>",
                        " select id,name,(with recursive r as (select * from gdm_sys_organization s where s.valid = 1 and id = o.id  union all select y.* from gdm_sys_organization y join r on r.id = y.pid where y.valid = 1) select string_agg(code,',') from r where r.id &lt;> o.id) childCode from gdm_sys_organization o where id in ",
                        "<foreach collection='orgIds' item='orgid' open='(' separator=',' close=')'>",
                        "#{orgid}",
                        "</foreach>",
                        " order by order_number </script>"
        })
        List<Map<String, Object>> selectOrgListWithCodes(List<String> orgIds);

        @Select("SELECT id org_id,org_code,org_name,level org_level_code,order_number org_order FROM gdm_gis_region where ST_Intersects(ST_PointFromText('POINT(${lon} ${lat})', 4326),geom) and org_level &lt;&gt; '11001' order by order_number")
        List<OrgInfoEntity> getOrgDDInfoByLonLat(String lon, String lat);
}
