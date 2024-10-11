package comm.gis.gdm.module.deduce.domain;

import java.sql.Timestamp;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonFormat;

import comm.gis.gdm.module.system.domain.OrgInfoEntity;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@TableName("gdm_deduce_point")
public class DeducePointEntity {

    @ApiModelProperty("id")
    private Long id;

    @ApiModelProperty("任务编号")
    private String taskId;

    @ApiModelProperty("名称")
    private String name;

    @ApiModelProperty("类型")
    private String type;

    @ApiModelProperty("阶段")
    private Integer stage;

    @ApiModelProperty("维度")
    private Double lon;

    @ApiModelProperty("经度")
    private Double lat;

    @ApiModelProperty("动作")
    private String action;

    @ApiModelProperty("备注")
    private String memo;

    @ApiModelProperty("一级单位编码")
    @TableField(value = "orgid_l1")
    private String orgLevel1;

    @ApiModelProperty("二级单位编码")
    @TableField(value = "orgid_l2")
    private String orgLevel2;

    @ApiModelProperty("创建人")
    private String creator;

    @ApiModelProperty(value = "创建时间", example = "2018-10-01 12:18:48")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Timestamp createTime;

    @ApiModelProperty(value = "创建时间", example = "2018-10-01 12:18:48")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Timestamp updateTime;

    @ApiModelProperty("是否启用")
    private Integer isUsed;

    @ApiModelProperty("是否删除")
    private Integer isDeleted;

    @ApiModelProperty("责任领导")
    @TableField(value = "zrld")
    private String zrld;

    @ApiModelProperty("联系电话")
    @TableField(value = "lxdh")
    private String lxdh;

    @ApiModelProperty("单位名称")
    @TableField(value = "orgname")
    private String ORGNAME;

    @ApiModelProperty("巡逻人员")
    @TableField(exist = false)
    private String xlry;

    @ApiModelProperty("显示巡逻人员")
    @TableField(exist = false)
    private String showxlry;

    @ApiModelProperty("所属单位")
    @TableField(exist = false)
    private OrgInfoEntity Organization;
}
