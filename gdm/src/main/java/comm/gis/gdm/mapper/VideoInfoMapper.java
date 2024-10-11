package comm.gis.gdm.mapper;

import java.util.*;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import comm.gis.gdm.module.alarm.domain.*;

@Mapper
public interface VideoInfoMapper extends BaseMapper<VideoInfoEntity> {

    @Select("<script> select * from gdm_video_device where valid = 1 ${partSqlString} </script>")
    List<VideoInfoEntity> getVideoInfoBySql(String partSqlString);

}
