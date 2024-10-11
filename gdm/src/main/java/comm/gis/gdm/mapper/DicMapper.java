package comm.gis.gdm.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import comm.gis.gdm.module.system.domain.*;

@Mapper
public interface DicMapper {

        @Select("<script> ${sqlstring} </script>")
        List<Map<String, Object>> selectDicInfoBySql(String sqlstring);

        @Select("select id,code,name from gdm_dic_orgtype where valid =1 and deleted = 0")
        List<Map<String, Object>> selectDicOrgType();

        @Select("select id,code,name from gdm_dic_caselevel where valid =1 and deleted = 0")
        List<Map<String, Object>> selectDicCaseLevel();

        @Select({
                        "<script>",
                        "select id typeId, code typeCode, name typeName, order_number orderNumber from gdm_dic_policetype where id in ",
                        "<foreach collection='typeIds' item='typeid' open='(' separator=',' close=')'>",
                        "#{typeid}",
                        "</foreach>",
                        " order by order_number asc </script>"
        })
        List<PoliceTypeEntity> selectDicPoliceType(List<String> typeIds);

        @Select("select id typeId, code typeCode, name typeName, order_number orderNumber from gdm_dic_policetype where valid =1 order by order_number asc ")
        List<PoliceTypeEntity> selectAllDicPoliceType();

        @Select({
                        "<script>",
                        "select id statusId, code statusCode, name statusName, order_number orderNumber from gdm_dic_status where id in ",
                        "<foreach collection='statusIds' item='statusid' open='(' separator=',' close=')'>",
                        "#{statusid}",
                        "</foreach>",
                        " order by order_number asc </script>"
        })
        List<PoliceStatusEntity> selectDicPoliceStatus(List<String> statusIds);

        @Select("select id statusId, code statusCode, name statusName, order_number orderNumber from gdm_dic_status where valid =1 order by order_number asc")
        List<PoliceStatusEntity> selectAllDicPoliceStatus();
}
