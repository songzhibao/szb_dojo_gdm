package comm.gis.gdm.module.police.domain;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.*;

@Data
public class OrgInfoWithPolicesEntity {

    @ApiModelProperty("机构id")
    private String orgId;

    @ApiModelProperty("树ID")
    private String treeId;

    @ApiModelProperty("机构名称")
    private String MC;

    @ApiModelProperty("机构父编号")
    private String parent;

    @ApiModelProperty("机构级别id")
    private String orgLevelCode;

    @ApiModelProperty("机构级别名称")
    private String orgLevelName;

    @ApiModelProperty("单位排序序号")
    private Integer orgOrder;

    @ApiModelProperty("单位警力列表")
    private List<PoliceInfoEntity> policeList;

    @ApiModelProperty("带警力子机构列表")
    private List<OrgInfoWithPolicesEntity> orgChildren;
}
