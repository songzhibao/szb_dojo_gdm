package comm.gis.gdm.module.duty.domain;

import java.sql.Timestamp;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonFormat;

import comm.gis.gdm.module.system.domain.OrgInfoEntity;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@TableName("gdm_duty_region")
public class DutyRegionEntity {

    @ApiModelProperty("id")
    private Long id;

    @ApiModelProperty("编号")
    private String code;

    @ApiModelProperty("名称")
    private String name;

    @ApiModelProperty("类型")
    private Integer type;

    @ApiModelProperty("状态")
    private Integer status;

    @ApiModelProperty("经度")
    private Double lon;

    @ApiModelProperty("维度")
    private Double lat;

    @ApiModelProperty("单位编码")
    private String orgId;

    @ApiModelProperty("一级单位编码")
    @TableField(value = "orgid_l1")
    private String orgLevel1;

    @ApiModelProperty("二级单位编码")
    @TableField(value = "orgid_l2")
    private String orgLevel2;

    @ApiModelProperty("责任领导")
    @TableField(value = "zrld")
    private String ZRLD;

    @ApiModelProperty("联系电话")
    @TableField(value = "lxdh")
    private String LXDH;

    @ApiModelProperty("单位电话")
    @TableField(value = "dwdh")
    private String DWDH;

    @ApiModelProperty("单位名称")
    @TableField(value = "orgname")
    private String orgName;

    @ApiModelProperty("地址")
    @TableField(value = "address")
    private String ADDRESS;

    @ApiModelProperty("图形点坐标对象")
    private Object geom;

    @ApiModelProperty("图形点坐标信息")
    private String regionContent;

    @ApiModelProperty("必巡点")
    private String importantPoint;

    @ApiModelProperty("备注")
    private String memo;

    @ApiModelProperty("创建人")
    private String creator;

    @ApiModelProperty("填充颜色")
    @TableField(value = "fillcolor")
    private String FILLCOLOR;

    @ApiModelProperty("是否使用")
    private Integer isused;

    @ApiModelProperty("是否删除")
    private Integer isdeleted;

    @ApiModelProperty(value = "创建时间", example = "2018-10-01 12:18:48")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Timestamp createTime;

    @ApiModelProperty(value = "修改时间", example = "2018-10-01 12:18:48")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Timestamp updateTime;

    @ApiModelProperty("巡逻人员")
    @TableField(exist = false)
    private String XLRY;

    @ApiModelProperty("显示巡逻人员")
    @TableField(exist = false)
    private String showxlry;

    @ApiModelProperty("所属单位")
    @TableField(exist = false)
    private OrgInfoEntity Organization;
}
