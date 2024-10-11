package comm.gis.gdm.module.police.domain;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import java.util.*;

@Data
public class PoliceStatOrgEntity {

    @ApiModelProperty("单位ID")
    private String orgId;

    @ApiModelProperty("单位编号")
    private String orgCode;

    @ApiModelProperty("单位名称")
    private String orgName;

    @ApiModelProperty("单位级别")
    private String orgLevel;

    @ApiModelProperty("在线数量")
    private Integer onlineCount = 0;

    @ApiModelProperty("警力总数")
    private Integer totalCount = 0;

    @ApiModelProperty("排序编号")
    private Integer orderNumber;

    @ApiModelProperty("单位警力类型统计")
    private List<PoliceStatTypeEntity> policeTypeList;
}
