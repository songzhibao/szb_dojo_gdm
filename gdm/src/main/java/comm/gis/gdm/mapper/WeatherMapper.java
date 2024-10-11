package comm.gis.gdm.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.*;

@Mapper
public interface WeatherMapper {

    @Select("SELECT weather,data FROM weather where data &gt;= timestamp '${startTime}' and data &gt;= timestamp '${endTime}' ")
    List<Map<String, Object>> selectWeathers(String startTime, String endTime);

}
