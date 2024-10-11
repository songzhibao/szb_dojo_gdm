package comm.gis.gdm.module.caseinfo.domain;

import java.util.List;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class CaseSumEntity {

    @ApiModelProperty("ID")
    private String id;

    @ApiModelProperty("编号")
    private String code;

    @ApiModelProperty("类型级别字符串")
    private String ays;

    @ApiModelProperty("名称")
    private String name;

    @ApiModelProperty("类型级别级别")
    private Integer caseTypeLevel;

    @ApiModelProperty("父级别编号")
    private String parentId;

    @ApiModelProperty("当前统计数量")
    private Integer counts;

    @ApiModelProperty("同比统计数量")
    private Integer countsTb;

    @ApiModelProperty("环比统计数量")
    private Integer countsHb;

    @ApiModelProperty("下级列表")
    private List<CaseSumEntity> children;

}
