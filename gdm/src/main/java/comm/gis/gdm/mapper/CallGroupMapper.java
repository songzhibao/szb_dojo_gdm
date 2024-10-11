package comm.gis.gdm.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import comm.gis.gdm.module.police.domain.CallGroupEntity;
import comm.gis.gdm.module.police.domain.PoliceInfoEntity;

@Mapper
public interface CallGroupMapper extends BaseMapper<CallGroupEntity> {

    @Select({
            "<script>",
            " select t.*,m.group_id from gdm_view_police t inner join gdm_sys_call_group_member m on t.itemid = m.person_id where itemid in(select person_id from gdm_sys_call_group_member where group_id in ",
            "<foreach collection='groupIds' item='groupid' open='(' separator=',' close=')'>",
            "#{groupid}",
            "</foreach>",
            ") order by itemid </script>"
    })
    List<PoliceInfoEntity> selectCallGroupMemberList(List<String> groupIds);
}
