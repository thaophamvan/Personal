import Http from '../../../core/scripts/ultis/Http';
import {
  API_PARTS_DIAGRAM, API_DIAGRAM_LIST
} from '../../../core/scripts/constants';


class PartsByDiagramServices extends Http {
  // fetchPartsDiagram = (text, diagramCode) => this.get(`${API_PARTS_DIAGRAM}?text=${text}&diagramCode=${diagramCode}`, true);

  fetchPartList = (body) => this.post(API_PARTS_DIAGRAM, body, true);

  fetchDiagramList = (productCode, partType) => this.get(`${API_DIAGRAM_LIST}?productcode=${productCode}&diagramCode=${partType}`, true);
}

export default new PartsByDiagramServices();
