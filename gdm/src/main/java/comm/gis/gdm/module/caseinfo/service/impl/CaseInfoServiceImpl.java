package comm.gis.gdm.module.caseinfo.service.impl;

import java.sql.Timestamp;
import java.util.*;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.alibaba.fastjson.JSONObject;

import comm.gis.gdm.mapper.*;
import comm.gis.gdm.module.caseinfo.domain.*;
import comm.gis.gdm.module.caseinfo.service.CaseInfoService;
import comm.gis.gdm.util.SqlUtils;
import comm.gis.gdm.util.TimeUtils;

@Service
public class CaseInfoServiceImpl implements CaseInfoService {

    @Autowired
    private CaseMapper caseDao;

    @Autowired
    private OrganizationMapper orgMapper;

    @Override
    public List<CaseInfoEntity> getCaseInfoList(
            String startTime,
            String endTime,
            List<Integer> caseTypes,
            List<String> orgCodes,
            String gisQueryType,
            String gisQueryValue,
            String caseCode,
            Integer limit) {

        String filterSql = SqlUtils.getFilter("info.duty_orgid", orgCodes, "case_type", caseTypes,
                null, null, null, null);
        if (startTime != null) {
            filterSql += String.format(" and case_time >= TIMESTAMP '%s' ", startTime);
        }
        if (endTime != null) {
            filterSql += String.format(" and case_time <= TIMESTAMP '%s' ", endTime);
        }
        if (StringUtils.hasText(caseCode)) {
            filterSql += String.format(" and info.case_code='%s'", caseCode);
        }

        filterSql += this.getGisQueryPartSql(gisQueryType, gisQueryValue);
        if (limit != null) {
            filterSql += "limit " + limit;
        }

        List<CaseInfoEntity> result = this.caseDao.getCaseInfoByCondition(filterSql);
        return result;
    }

    @Override
    public CaseInfoEntity getCaseDetailInfo(
            String caseCode) {
        List<CaseInfoEntity> list = this.caseDao.getCaseInfoByCondition(" and info.case_code= '" + caseCode + "'");
        if (list != null && list.size() > 0) {
            return list.get(0);
        }
        return null;
    }

    @Override
    public List<CaseSumEntity> getCaseTypeCount(String startTime,
            String endTime) {
        List<CaseSumEntity> list = this.caseDao.getCaseTypeCount(Timestamp.valueOf(startTime),
                Timestamp.valueOf(endTime), "");
        if (list != null) {
            for (CaseSumEntity caseSumEntity : list) {
                caseSumEntity.setAys("'" + caseSumEntity.getId() + "'");
                caseSumEntity.setCode(caseSumEntity.getId());
            }
            return this.getSunItems(list, null);
        }
        return null;
    }

    @Override
    public JSONObject getCaseTypeCountDetail(String startTime, String endTime, List<String> orgCodes,
            List<Integer> caseTypes) {

        JSONObject jResult = new JSONObject();

        String caseTypeSql = SqlUtils.getFilter(null, null, "case_type", caseTypes,
                null, null, null, null);
        String filterSql = "";
        if (startTime != null) {
            filterSql = String.format(" and case_time >= TIMESTAMP '%s' ", startTime);
        }
        if (endTime != null) {
            filterSql += String.format(" and case_time <= TIMESTAMP '%s' ", endTime);
        }
        List<CaseInfoEntity> currentList = this.caseDao.getCaseInfoByCondition(filterSql + caseTypeSql);
        jResult.put("current", currentList);

        if (startTime != null) {
            filterSql = String.format(" and case_time >= TIMESTAMP '%s' ", TimeUtils.calCompareTime(startTime, "1"));
        }
        if (endTime != null) {
            filterSql += String.format(" and case_time <= TIMESTAMP '%s' ", TimeUtils.calCompareTime(endTime, "1"));
        }
        List<CaseInfoEntity> tbList = this.caseDao.getCaseInfoByCondition(filterSql + caseTypeSql);
        jResult.put("tb", tbList);

        if (startTime != null) {
            filterSql = String.format(" and case_time >= TIMESTAMP '%s' ", TimeUtils.calCompareTime(startTime, "2"));
        }
        if (endTime != null) {
            filterSql += String.format(" and case_time <= TIMESTAMP '%s' ", TimeUtils.calCompareTime(endTime, "2"));
        }
        List<CaseInfoEntity> hbList = this.caseDao.getCaseInfoByCondition(filterSql + caseTypeSql);
        jResult.put("hb", hbList);

        List<Map<String, Object>> childOrgList = this.orgMapper.selectChildOrgListWithCodes(orgCodes);

        List<StatInfoEntity> relist = new ArrayList<>();
        for (Map<String, Object> map : childOrgList) {
            StatInfoEntity bean = new StatInfoEntity();
            bean.setOrgId(map.get("id").toString());
            bean.setOrgCode(map.get("id").toString());
            bean.setOrgName(map.get("name").toString());

            if (bean.getOrgId() == null) {
                continue;
            }
            List<CaseInfoEntity> filterList = currentList.stream()
                    .filter(o -> bean.getOrgId().equals(o.getOrgId())
                            || (map.get("childcode") != null
                                    && map.get("childcode").toString()
                                            .indexOf(bean.getOrgId()) >= 0))
                    .collect(Collectors.toList());
            bean.setCount(filterList.size());

            if (tbList != null) {
                filterList = tbList.stream()
                        .filter(o -> bean.getOrgId().equals(o.getOrgId())
                                || (map.get("childcode") != null
                                        && map.get("childcode").toString()
                                                .indexOf(bean.getOrgId()) >= 0))
                        .collect(Collectors.toList());
                bean.setCount_tb(filterList.size());
            }

            if (hbList != null) {
                filterList = hbList.stream()
                        .filter(o -> bean.getOrgId().equals(o.getOrgId())
                                || (map.get("childcode") != null
                                        && map.get("childcode").toString()
                                                .indexOf(bean.getOrgId()) >= 0))
                        .collect(Collectors.toList());
                bean.setCount_hb(filterList.size());
            }

            relist.add(bean);
        }

        jResult.put("orgCounts", relist);

        return jResult;
    }

    @Override
    public CaseStatEntity getCaseInfoStat(CaseStatVO queryVO) {
        CaseStatEntity sum = new CaseStatEntity();
        String[] legend = new String[3];
        Timestamp startTime = Timestamp.valueOf(queryVO.getStartTime());
        Timestamp endTime = Timestamp.valueOf(queryVO.getEndTime());
        legend[0] = getLegendName(startTime, endTime, "当前");

        String filterSql = SqlUtils.getFilter("duty_orgid", queryVO.getOrgCodes(), "case_type", queryVO.getCaseTypes(),
                null, null, null, null);

        List<CaseSumEntity> list = this.caseDao.getCaseTypeCount(Timestamp.valueOf(queryVO.getStartTime()),
                Timestamp.valueOf(queryVO.getEndTime()), filterSql);
        if (list != null) {
            for (CaseSumEntity caseSumEntity : list) {
                caseSumEntity.setAys("'" + caseSumEntity.getId() + "'");
                caseSumEntity.setCode(caseSumEntity.getId());
            }
            if (queryVO.getIsCheckTB()) {
                startTime = Timestamp.valueOf(TimeUtils.calCompareTime(queryVO.getStartTime(), "1"));
                endTime = Timestamp.valueOf(TimeUtils.calCompareTime(queryVO.getEndTime(), "1"));
                legend[1] = getLegendName(startTime, endTime,
                        "同比");
            }
            if (queryVO.getIsCheckHB()) {
                startTime = Timestamp.valueOf(TimeUtils.calCompareTime(queryVO.getStartTime(), "2"));
                endTime = Timestamp.valueOf(TimeUtils.calCompareTime(queryVO.getEndTime(), "2"));
                legend[2] = getLegendName(startTime, endTime,
                        "环比");
            }
            sum.setChildren(list);
            sum.setLegend(legend);
        }
        return sum;
    }

    @Override
    public CaseStatEntity getCaseFor24Line(CaseStatVO queryVO) {
        CaseStatEntity sum = new CaseStatEntity();
        String[] legend = new String[3];
        Timestamp startTime = Timestamp.valueOf(queryVO.getStartTime());
        Timestamp endTime = Timestamp.valueOf(queryVO.getEndTime());
        legend[0] = getLegendName(startTime, endTime, "当前");

        String filterSql = SqlUtils.getFilter("duty_orgid", queryVO.getOrgCodes(), "case_type", queryVO.getCaseTypes(),
                null, null, null, null);

        List<CaseSumEntity> list = this.caseDao.getCaseFor24Line(Timestamp.valueOf(queryVO.getStartTime()),
                Timestamp.valueOf(queryVO.getEndTime()), filterSql);
        if (list != null) {
            for (CaseSumEntity caseSumEntity : list) {
                caseSumEntity.setAys("'" + caseSumEntity.getId() + "'");
                caseSumEntity.setCode(caseSumEntity.getId());
            }
            if (queryVO.getIsCheckTB()) {
                startTime = Timestamp.valueOf(TimeUtils.calCompareTime(queryVO.getStartTime(), "1"));
                endTime = Timestamp.valueOf(TimeUtils.calCompareTime(queryVO.getEndTime(), "1"));
                legend[1] = getLegendName(startTime, endTime,
                        "同比");
            }
            if (queryVO.getIsCheckHB()) {
                startTime = Timestamp.valueOf(TimeUtils.calCompareTime(queryVO.getStartTime(), "2"));
                endTime = Timestamp.valueOf(TimeUtils.calCompareTime(queryVO.getEndTime(), "2"));
                legend[2] = getLegendName(startTime, endTime,
                        "环比");
            }
            sum.setChildren(list);
            sum.setLegend(legend);
        }
        return sum;
    }

    private String getLegendName(Timestamp startTime, Timestamp endTime, String type) {
        Calendar start = Calendar.getInstance();
        start.setTime(startTime);
        Calendar end = Calendar.getInstance();
        end.setTime(endTime);
        return type + "[" + start.get(Calendar.MONTH) + "-" + start.get(Calendar.MONDAY) + "/" + end.get(Calendar.MONTH)
                + "-" + end.get(Calendar.MONDAY) + "]";
    }

    private List<CaseSumEntity> getSunItems(List<CaseSumEntity> list, String casetype_pid) {
        List<CaseSumEntity> items = null;
        if (casetype_pid == null) {
            items = list.stream().filter(o -> o.getParentId() == null).collect(Collectors.toList());
        } else {
            items = list.stream().filter(o -> o.getParentId() != null && o.getParentId().equals(casetype_pid))
                    .collect(Collectors.toList());
        }
        if (items != null && items.size() > 0) {
            List<CaseSumEntity> _gridTree = new ArrayList<>();
            for (CaseSumEntity item : items) {
                List<CaseSumEntity> childList = getSunItems(list, item.getId());
                if (childList != null) {
                    CaseSumEntity s = new CaseSumEntity();
                    s.setId(item.getId());
                    s.setCode(item.getId());
                    s.setName(item.getName());
                    s.setCaseTypeLevel(item.getCaseTypeLevel());
                    s.setParentId(item.getParentId());
                    Integer _counts = 0;
                    Integer _counts_tb = 0;
                    Integer _counts_hb = 0;
                    String _ays = "";
                    for (CaseSumEntity l : childList) {
                        _counts += l.getCounts();
                        _counts_tb += l.getCountsTb();
                        _counts_hb += l.getCountsHb();
                        _ays += "," + l.getAys();
                    }

                    s.setCounts(item.getCounts() + _counts);
                    s.setCountsTb(item.getCountsTb() + _counts_tb);
                    s.setCountsHb(item.getCountsHb() + _counts_hb);
                    s.setAys(item.getAys() + _ays);

                    s.setChildren(childList);
                    _gridTree.add(s);
                } else {
                    _gridTree.add(item);
                }
            }
            return _gridTree;
        } else {
            return null;
        }
    }

    private String getGisQueryPartSql(String gisQueryType, String gisQueryValue) {
        String tableName = "info";
        if (null != gisQueryType && null != gisQueryValue) {
            switch (gisQueryType) {
                case "LineString":
                    return String.format(" and public.ST_Within(public.st_geomfromtext('POINT('||" + tableName
                            + ".lon||' '||" + tableName
                            + ".lat||')',4326),public.st_buffer(public.st_geomfromtext('Linestring(%s)',4326),0.002)) ",
                            gisQueryValue);
                case "Polygon":
                    return String.format(
                            " and public.ST_Within(public.st_geomfromtext('POINT('||" + tableName + ".lon||' '||"
                                    + tableName + ".lat||')',4326),public.ST_PolygonFromText('POLYGON((%s))', 4326)) ",
                            gisQueryValue);
                case "Circle":
                    return String.format(" and public.st_point_inside_circle('POINT('||" + tableName
                            + ".lon||' '||" + tableName + ".lat||')',%s) ", gisQueryValue);
                default:
                    break;
            }
        }
        return "";
    }

}
