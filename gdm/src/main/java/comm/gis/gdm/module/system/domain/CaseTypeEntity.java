package comm.gis.gdm.module.system.domain;

import java.util.List;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class CaseTypeEntity {

    @ApiModelProperty("id")
    private String id;

    @ApiModelProperty("编号")
    private String code;

    @ApiModelProperty("名称")
    private String name;

    @ApiModelProperty("等級")
    private String level;

    @ApiModelProperty("勾选")
    private Boolean checked;

    @ApiModelProperty("父编号")
    private String parentId;

    @ApiModelProperty("排序序号")
    private Integer orderNumber;

    @ApiModelProperty("子集")
    private List<CaseTypeEntity> children;
}
