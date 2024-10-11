package comm.gis.gdm.common.domain;

import java.util.List;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * 查询参数
 *
 */
@Data
public class BaseQueryVO {

    @ApiModelProperty("开始时间")
    private String startTime;

    @ApiModelProperty("结束时间")
    private String endTime;

    @ApiModelProperty("单位数组")
    private List<String> orgCodes;

}
