package comm.gis.gdm.module.deduce.domain;

import java.sql.Timestamp;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonFormat;

import comm.gis.gdm.module.system.domain.OrgInfoEntity;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@TableName("gdm_deduce_region")
public class DeduceRegionEntity {

    @ApiModelProperty("ID")
    private Long Id;

    @ApiModelProperty("任务编号")
    private String taskId;

    @ApiModelProperty("名称")
    private String name;

    @ApiModelProperty("阶段")
    private Integer stage;

    @ApiModelProperty("内容")
    private String content;

    @ApiModelProperty("边框颜色")
    private String bordercolor;

    @ApiModelProperty("边框宽度")
    private String borderwidth;

    @ApiModelProperty("填充颜色")
    private String fillcolor;

    @ApiModelProperty("透明度")
    private String opacite;

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

    @ApiModelProperty("图形点坐标对象")
    private Object geom;

    @ApiModelProperty("人员列表字符串")
    @TableField(exist = false)
    private String PoliceListStr;

    @ApiModelProperty("所属单位")
    @TableField(exist = false)
    private OrgInfoEntity Organization;
}
