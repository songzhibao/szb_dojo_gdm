package comm.gis.gdm.module.caseinfo.domain;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@TableName("gdm_case_caseinfo")
public class CaseInfoEntity {

    @ApiModelProperty("ID")
    private String id;

    @ApiModelProperty("警情编号")
    private String caseCode;

    @ApiModelProperty("警情地址")
    @TableField(value = "case_address")
    private String address;

    @ApiModelProperty("警情时间")
    private String caseTime;

    @ApiModelProperty("警情详情")
    @TableField(value = "case_detailedinfo")
    private String detailedInfo;

    @ApiModelProperty("警情类型编码")
    @TableField(value = "case_type")
    private String typeCode;

    @ApiModelProperty("类型名称名称")
    @TableField(exist = false)
    private String typeName;

    @ApiModelProperty("案由按大类id")
    @TableField(value = "case_type_l1")
    private String mainTypeCode;

    @ApiModelProperty("案由大类名称")
    @TableField(exist = false)
    private String mainTypeName;

    @ApiModelProperty("机构id")
    @TableField(value = "duty_orgid")
    private String orgId;

    @ApiModelProperty("机构名称")
    @TableField(exist = false)
    private String orgName;

    @ApiModelProperty("经度")
    private Double lon;

    @ApiModelProperty("纬度")
    private Double lat;

    @ApiModelProperty("等级编号")
    @TableField(value = "case_level")
    private String levelCode;

    @ApiModelProperty("等级名称")
    @TableField(exist = false)
    private String levelName;

    @ApiModelProperty("更新时间")
    private String updateTime;

}
