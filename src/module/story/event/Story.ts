import EventTask from "../../api/grpc/rpc/Event";
import {Doc as EventDoc} from "../../repository/event/Interface";

/**
 * @name ClientStory
 */
export class EventStory {

    /**
   * @name tasks
   */
    public tasks: {
      Event: EventTask;
  };

    /**
   * @name ClientStory
   */
    constructor() {
        this.tasks = {
            Event: EventTask.Instance()
        };
    }

    public on<T extends EventDoc>(filter: Required<T>, options?: any) {
        return this.tasks.Event.on({...filter, options});
    }

    public emit<T extends EventDoc>(filter: Required<T>, options?: any) {
        return this.tasks.Event.emit({...filter, options});
    }

}
