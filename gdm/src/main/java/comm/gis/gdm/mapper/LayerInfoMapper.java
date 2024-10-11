package comm.gis.gdm.mapper;

import java.util.*;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;

import comm.gis.gdm.module.layer.domain.*;

@Mapper
public interface LayerInfoMapper extends BaseMapper<LayerInfoEntity> {

    @Select("<script> select * from gdm_gis_layershow where layername = #{layerName} ${partSqlString} </script>")
    List<LayerShowEntity> selectLayerInfoBySql(String layerName, String partSqlString);

}
