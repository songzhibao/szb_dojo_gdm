package comm.gis.gdm.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import comm.gis.gdm.module.system.domain.CaseTypeEntity;

@Mapper
public interface CaseTypeMapper {

    @Select("select * from gdm_dic_casetype where id in (WITH RECURSIVE q AS (select i.ID from gdm_dic_casetype i where i.valid=1 and i.id = #{caseTypeCode} union all select t.ID from gdm_dic_casetype t JOIN q on q.ID= t.parent_id where t.valid=1 ) select * from q) ")
    List<CaseTypeEntity> getAllSonCaseTypes(String caseTypeCode);

    @Select("select id, code, name, casetype_level as level,parent_id parentId,order_number orderNumber from gdm_DIC_CASETYPE where valid =1 and deleted = 0 order by order_number")
    List<CaseTypeEntity> selectDicCaseType();
}
