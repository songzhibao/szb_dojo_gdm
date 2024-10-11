package comm.gis.gdm.module.alarm.domain;

import java.util.List;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * 查询参数
 *
 */
@Data
public class AlarmVO {

    @ApiModelProperty("单位数组")
    private List<String> orgCodes;

    @ApiModelProperty("关键字")
    private String keyWord;

    @ApiModelProperty("查询方式")
    private String gisQueryType;

    @ApiModelProperty("查询值")
    private String gisQueryValue;
}
