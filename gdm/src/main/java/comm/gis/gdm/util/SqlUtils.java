package comm.gis.gdm.util;

import java.util.*;

public class SqlUtils {

    public static String getGisQueryPartSql(String tableName, String gisQueryType, String gisQueryValue) {
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

    public static String getFilter(String orgField, List<String> orgCodes, String typeField, List<Integer> caseTypes,
            String sourceField, List<String> caseSource, String statusField, List<String> caseStatus) {
        String orgFilter = "";
        if (orgCodes != null && orgCodes.size() > 0) {
            orgFilter = SqlUtils.fillParam(orgCodes,
                    " with recursive r as (select id, pid from gdm_sys_organization where valid = 1 and id in (%s) union all select o.id, o.pid from gdm_sys_organization o join r on r.id = o.pid where valid = 1) select id from r ");
            orgFilter = String.format(" and " + orgField + " in (%s)", orgFilter);
        }

        String casetypeFilter = "";
        if (caseTypes != null && caseTypes.size() > 0) {
            casetypeFilter = SqlUtils.fillIntParam(caseTypes,
                    " with recursive r as (select id, parent_id, name from gdm_dic_casetype where valid = 1 and deleted = 0 and id in (%s) union all select t.id, t.parent_id, t.name from gdm_dic_casetype t join r on r.id = t.parent_id where valid = 1 and deleted = 0) select id from r  ");
            casetypeFilter = String.format(" and " + typeField + " in (%s)", casetypeFilter);
        }

        String casesoureFilter = "";
        if (caseSource != null && caseSource.size() > 0) {
            casesoureFilter = SqlUtils.fillParam(caseSource, " and " + sourceField + " in (%s) ");
        }
        String statusFilter = "";
        if (caseStatus != null && caseStatus.size() > 0) {
            statusFilter = SqlUtils.fillParam(caseStatus, " and " + statusField + " in (%s) ");
        }
        return orgFilter + casetypeFilter + casesoureFilter + statusFilter;
    }

    public static String getOrgFilter(String orgField, List<String> orgCodes) {
        return getOrgFilter(" and ", orgField, orgCodes);
    }

    public static String getOrgFilter(String andOr, String orgField, List<String> orgCodes) {
        String orgFilter = "";
        if (orgCodes != null && orgCodes.size() > 0) {
            orgFilter = SqlUtils.fillParam(orgCodes,
                    " with recursive r as (select id, pid from gdm_sys_organization where valid = 1 and id in (%s) union all select o.id, o.pid from gdm_sys_organization o join r on r.id = o.pid where valid = 1) select id from r ");
            orgFilter = String.format(andOr + orgField + " in (%s)", orgFilter);
        }
        return orgFilter;
    }

    public static String fillParam(List<String> list, String fillSql) {
        if (list != null && !list.isEmpty()) {
            StringJoiner sj = new StringJoiner(",");
            for (String s : list) {
                sj.add("'" + s + "'");
            }
            return String.format(fillSql, sj.toString());
        } else {
            return "";
        }
    }

    public static String fillIntParam(List<Integer> list, String fillSql) {
        if (list != null && !list.isEmpty()) {
            StringJoiner sj = new StringJoiner(",");
            for (Integer s : list) {
                sj.add(s.toString());
            }
            return String.format(fillSql, sj.toString());
        } else {
            return "";
        }
    }
}
