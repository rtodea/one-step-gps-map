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

export function fromDeviceToTreeNode(device: Device): TreeNode {
  return {
    name: device.display_name,
    children: []
  };
}

@Component({
  selector: 'app-one-step-gps-device-list',
  templateUrl: './one-step-gps-device-list.component.html',
  styleUrls: ['./one-step-gps-device-list.component.css']
})
export class OneStepGpsDeviceListComponent implements OnInit {
  treeNodes: TreeNode[] = [
    {
      name: 'Fruit',
      children: [
        {name: 'Apple', children: []},
        {name: 'Banana', children: []},
        {name: 'Fruit loops', children: []},
      ]
    }, {
      name: 'Vegetables',
      children: [
        {
          name: 'Green',
          children: [
            {name: 'Broccoli', children: []},
            {name: 'Brussels sprouts', children: []},
          ]
        }, {
          name: 'Orange',
          children: [
            {name: 'Pumpkins', children: []},
            {name: 'Carrots', children: []},
          ]
        },
      ]
    },
  ];

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
      const [onlineDevice, offlineDevices] = R.pipe(
        R.partition<Device>(R.prop('online')),
        R.map((partition: Device[]) => partition.map(fromDeviceToTreeNode))
      )(result_list);

      this.treeDataSource.data = [{
        name: 'Online Devices',
        children: onlineDevice,
      }, {
        name: 'Offline Devices',
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
