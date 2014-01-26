using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class MapLayout  {
	public float offset = 1;
	public List<Vector3> points { get; private set; }
	public MapLayout(Vector3[] pts)
	{
		points = new List<Vector3> ();
		foreach (Vector3 v in pts)
			addPoint (v);
	}
	public void addPoint(Vector3 p)
	{
		if (points.Count == 0) {
			points.Add (p);
		} else {
			if(points[points.Count - 1].z != p.z)
			{
				float dir = p.z - points[points.Count - 1].z;
				dir = dir / Mathf.Abs(dir);
				Vector3 p1 = new Vector3(p.x, p.y, points[points.Count - 1].z + dir * offset);
				Vector3 p2 = new Vector3(p.x, p.y, p.z - dir * offset);
				if(points.Count > 1)
					points.Add(p1);
				points.Add(p2);
				points.Add(p);
			}
			else if(points[points.Count - 1].x != p.x)
			{
				float dir = p.x - points[points.Count - 1].x;
				dir = dir / Mathf.Abs(dir);
				Vector3 p1 = new Vector3(points[points.Count - 1].x + dir * offset, p.y, p.z);
				Vector3 p2 = new Vector3(p.x - dir * offset, p.y, p.z);
				if(points.Count > 1)
					points.Add(p1);
				points.Add(p2);
				points.Add(p);
			}
		}
	}
	public Vector3[] getPoints()
	{
		return points.ToArray ();
	}
}
