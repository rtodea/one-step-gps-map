import { Component, OnInit } from '@angular/core';
import { Device, OneStepGpsService } from '../one-step-gps/one-step-gps.service';
import { FlatTreeControl } from '@angular/cdk/tree';
import * as R from 'ramda';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';

export type TreeNode = {
  name: string;
  children: TreeNode[];
};

export type ExpandableTreeNode = {
  expandable: boolean;
  name: string;
  level: number;
};

export function fromTreeNodeToExpandableTreeNode(node: TreeNode, level: number): ExpandableTreeNode {
  return {
    expandable: !!node.children && node.children.length > 0,
    name: node.name,
    level,
  };
}

export function fromObjectToTreeNode<T>(object: T): TreeNode[] {
  if (R.isNil(object) || R.isEmpty(object) || R.not(R.is(Object, object))) { return []; }
  return R.pipe(
    R.toPairs,
    R.map(([key, value]) => ({
      name: R.is(Object, value) ? `${key}: ...` : `${key}: ${value}`,
      children: fromObjectToTreeNode(value),
    }))
  )(object);
}

export function fromDeviceToTreeNode(device: Device): TreeNode {
  return {
    name: device.display_name,
    children: fromObjectToTreeNode<Device>(device),
  };
}

@Component({
  selector: 'app-one-step-gps-device-list',
  templateUrl: './one-step-gps-device-list.component.html',
  styleUrls: ['./one-step-gps-device-list.component.css']
})
export class OneStepGpsDeviceListComponent implements OnInit {
  treeControl = new FlatTreeControl<ExpandableTreeNode>(
    R.prop('level'),
    R.prop('expandable'),
  );

  treeFlattener = new MatTreeFlattener(
    fromTreeNodeToExpandableTreeNode,
    R.prop('level'),
    R.prop('expandable'),
    R.prop('children'),
  );

  treeDataSource = new MatTreeFlatDataSource(
    this.treeControl,
    this.treeFlattener,
  );

  constructor(oneStepGpsService: OneStepGpsService) {
    oneStepGpsService.devices().subscribe(({result_list}) => {
      const [onlineDevices, offlineDevices] = R.pipe(
        R.partition<Device>(R.prop('online')),
        R.map((partition: Device[]) => partition.map(fromDeviceToTreeNode))
      )(result_list);

      this.treeDataSource.data = [{
        name: `Online Devices (${onlineDevices.length})`,
        children: onlineDevices,
      }, {
        name: `Offline Devices (${offlineDevices.length})`,
        children: offlineDevices
      }];
    });
  }

  ngOnInit(): void {
  }

  hasChild(_: number, {expandable}: ExpandableTreeNode) {
    return expandable;
  }
}
