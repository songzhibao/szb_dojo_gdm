package comm.gis.gdm.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface WarningMapper {

    @Select("<script> select * from gdm_jamroad_warninginfo where time &gt;= '${startTime}' and time &lt;= '${endTime}' ${sqlcondition}  </script>")
    List<Map<String, Object>> selectIllegalEventList(String startTime, String endTime, String sqlcondition);

}
