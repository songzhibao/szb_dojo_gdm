package comm.gis.gdm.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;

import comm.gis.gdm.module.system.domain.ConfigInfoEntity;

@Mapper
public interface ConfigMapper extends BaseMapper<ConfigInfoEntity> {

}
